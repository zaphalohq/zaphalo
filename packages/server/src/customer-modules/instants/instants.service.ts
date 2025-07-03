import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import axios from 'axios';
import { ContactsService } from '../contacts/contacts.service';
import fs from 'fs';
import { TemplateService } from '../template/template.service';
import { Template } from '../template/template.entity';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class instantsService {
            private instantsRepository: Repository<WhatsappInstants>
        private templateRepository: Repository<Template>
    constructor(
        @Inject(CONNECTION) connection: Connection,


        private readonly workspaceService: WorkspaceService,
        private readonly contactsService: ContactsService,
      ) {
        this.instantsRepository = connection.getRepository(WhatsappInstants);
        this.templateRepository = connection.getRepository(Template);
      }

    async CreateInstants(WhatsappInstantsData: CreateFormDataInput, workspaceId: string): Promise<WhatsappInstants | null | string> {
        console.log(WhatsappInstantsData);
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")

        const instant = await this.instantsRepository.findOne({ where: {phoneNumberId : WhatsappInstantsData.phoneNumberId,
            //  workspace : {id : workspaceId}
            }
            });
        if (instant) {
            return instant
        }

        const instants = await this.instantsRepository.find({ 
            // where: { id: workspaceId }
         });

        let defaultSelected = false;
        if (instants.length < 1) {
            defaultSelected = true
        }
        const whatappInstants = this.instantsRepository.create({
            name: WhatsappInstantsData.name,
            appId: WhatsappInstantsData.appId,
            phoneNumberId: WhatsappInstantsData.phoneNumberId,
            businessAccountId: WhatsappInstantsData.businessAccountId,
            accessToken: WhatsappInstantsData.accessToken,
            appSecret: WhatsappInstantsData.appSecret,
            // workspace,
            defaultSelected: defaultSelected
        })
        await this.contactsService.createContacts({
            contactName: WhatsappInstantsData.name,
            phoneNo: Number(WhatsappInstantsData.phoneNumberId),
            defaultContact: true,
        }, workspaceId)
        await this.instantsRepository.save(whatappInstants)
        return whatappInstants;
    }

    async SyncTemplate(instants: any,workspaceId: string, businessAccountId: string, accessToken: string): Promise<any> {
        const response = await axios.get(
      `https://graph.facebook.com/v22.0/${businessAccountId}/message_templates`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const templates = response.data?.data;
    
    const workspace = await this.workspaceService.findWorkspaceById(workspaceId);
    if (!workspace) throw new Error('Workspace not found');

    for (const template of templates) {
    console.log(template.components,'.........................remplates,,,,,,,,,,,,,,,,,,,');
      const components = template.components || [];
      const header = components.find((component) => component.type === 'HEADER');
      const body = components.find((component) => component.type === 'BODY');
      const footer = components.find((component) => component.type === 'FOOTER');
      const buttonsComponent = components.find((component) => component.type === 'BUTTONS');

      const variableList: { name: string; value: string }[] = [];
      if (body?.example?.body_text?.[0]) {
        body.example.body_text?.[0].forEach((variable, index) => {
          variableList.push({ name: `{{${index + 1}}}`, value: variable });
        });
      }

      const buttons = buttonsComponent?.buttons?.map((btn) => ({
        type: btn.type,
        text: btn.text,
        url: btn.url,
        phone_number: btn.phone_number
      }));

      const newTemplate = this.templateRepository.create({
        account: instants?.id,
        templateName: template.name,
        status: template.status,
        templateId: template.id,
        category: template.category,
        language: template.language,
        headerType: header?.format,
        bodyText: body?.text,
        footerText: footer?.text,
        header_handle: header?.example?.header_handle?.[0]?.handle || null,
        button: buttons,
        variables: variableList,
        // workspace
      });
      await this.templateRepository.save(newTemplate);
    }

    return {
      success: true,
      message: 'Templates imported successfully',
      count: templates.length
    };
    };


    async TestInstants(phoneNumberId: string, accessToken: string) {
        try {
            const url = `https://graph.facebook.com/v22.0/${phoneNumberId}?access_token=${accessToken}`;

            const response = await axios.get(url);

            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.log(error);

            return {
                success: false,
                error: error?.response?.data?.error?.message || error.message
            };
        }
    };

    async findAllInstants(workspaceId: string): Promise<WhatsappInstants[]> {
        return await this.instantsRepository.find({
            // where: { workspace: { id: workspaceId } },
            order: { createdAt: 'ASC' }, // Sort by creation time
        });
    }

    async UpdateInstants(id: string, updatedInstants: CreateFormDataInput): Promise<WhatsappInstants | null> {
        const existingInstants = await this.instantsRepository.findOne({ where: { id } });
        if (!existingInstants) {
            throw new NotFoundException(`Instant with ID ${id} not found`);
        }
        Object.assign(existingInstants, updatedInstants); // Merge input data into the existing entity

        return this.instantsRepository.save(existingInstants); // Save updated instant to the database
    }

    async DeleteInstants(id: string): Promise<WhatsappInstants | null> {
        const deleteInstants = await this.instantsRepository.findOne({ where: { id } });
        if (deleteInstants)
            return await this.instantsRepository.remove(deleteInstants)
        else
            return null

    }

    async InstantsSelection(instantsId: string, workspaceId: string) {
        const findSelectedInstants = await this.FindSelectedInstants(workspaceId)

        await this.instantsRepository.update(
            { id: findSelectedInstants?.id },
            { defaultSelected: false }
        )
        await this.instantsRepository.update(
            { id: instantsId },
            { defaultSelected: true }
        )
        return await this.findAllInstants(workspaceId)
    }


    async FindSelectedInstants(workspaceId? : string) {
        return this.instantsRepository.findOne({
            where: {
                defaultSelected: true,
                // workspace: { id: workspaceId }
            }
        });
    }

    async findInstantsByPhoneNoId(phoneNumberId: string): Promise<WhatsappInstants | null> {
        return await this.instantsRepository.findOne({
            where: { phoneNumberId: phoneNumberId},
            relations: ['workspace']
        });
    }

    async findInstantsByInstantsId(instantsId: string): Promise<WhatsappInstants | null> {
        return await this.instantsRepository.findOne({
            where: { id: instantsId },
            relations: ['workspace']
        });
    }

    async whatsappApiPost(data) {
        return await axios({
            url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer EAAao8Mkc6lMBO1ySEZCLWhiI7Xt2FIQlPFQdFdPESTlZAlwxFaHZBZBZCxyN11dsryzwHdr9xxaLIawMtUxsQ5uxsUDCdigvKikhhETCoJgxt0mzMVbgR2PZCuT8owCpETLS8TxZB2YZCPsOvRpOTA9hIwDFW0werkxZCoPWLK0hj6Y8apUDsH6kwHA2zdHf7id7SGZBmnOo8qSZC0iFQs5LZB4SeNVpX0sh2J4PWG0ZD',
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        })
    }

    async sendTemplateMessage() {
        // const response = await this.whatsappApiPost({
        //         "messaging_product": "whatsapp",
        //         "to": "917202031718",
        //         "type": "template",
        //         "template": {
        //             "name": "hello_world",
        //             "language": {
        //                 "code": "en_US"
        //             }
        //         }
        //     })
        //     console.log(response.data);
        const url = `https://graph.facebook.com/v22.0/565830889949112/messages`;

        const payload = {
            messaging_product: 'whatsapp',
            to: 917202031718,
            type: 'template',
            template: {
                name: 'welcome_message_102',
                language: { code: 'en_US' },
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'image',
                                image: {
                                    link: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png'
                                }
                            }
                        ]
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: 'Chintan Patel'
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer EAAao8Mkc6lMBO3j9es54Sq0xi4194bhdwVZAxoegjZBlWFZAoCncsr7DEJFE18e3GL5NVUsq1186D5SUdALXZBSARVMTaiJqKLKY7mB1ZBddIiaLqNSPkaRDCftrQ8DzgoGhZAP2ZB4hiM2XjrWZAARyyyG97OXSB5B7hAk9yNRo7KLVyTX5JdaLinSCViFQKRBsHvO3rU1HfGei0dblfkHrb8yVyMPe6fGoJssZD`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Message sent:', response.data);
        } catch (error) {
            console.error('Send message failed:', error.response?.data || error.message);
        }
        return "response"
    }

    async sendTextMessage() {
        // const response =   await this.whatsappApiPost({
        //         "messaging_product": "whatsapp",
        //         "to": "917202031718",
        //         "type": "text",
        //         "text": {
        //             'body' : "this is the text message"
        //         }
        //     })
        //     console.log(response.data);


        // const token = 'EAAao8Mkc6lMBO3ksn7duH8zbgFSMFxDlsQtqnACih41A8q7jHvRkAvt3kbfIGOadkZAG89EFL0ZBx0IrLuZBACFBw9QZBbFIB0yR0T1qV2KIgyMaT2RVZCrtbg26TGCZB9AsIH5IeyP6jBfgoyPSGx7cOR9I6HE0sK61RF82R8LHsJFY2ItHxej9ph22MGN30yJw3LZBPu48xTzUjN29L1O9ZCraDpsZBZCEfZBxC8ZD';
        // const phoneNumberId = '565830889949112';
        // const recipient = '917202031718'; // without "+" sign

        // const payload = {
        //     messaging_product: 'whatsapp',
        //     to: recipient,
        //     type: 'text',
        //     text: {
        //         preview_url: false,
        //         body: 'Hello! This is a test message from the WhatsApp Cloud API.'
        //     }
        // };

        // axios.post(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, payload, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then(res => {
        //         console.log('✅ Message sent:', res.data);
        //     })
        //     .catch(err => {
        //         console.error('❌ Error:', err.response?.data || err.message);
        //     });
        // return "response";



        const form = new FormData();
        form.append('file', '@/uploads\\1746617752805-abc.png');
        // form.append('file', String(fs.createReadStream('uploads\\1746617752805-abc.png')));
        form.append('type', 'image/png');
        form.append('messaging_product', 'whatsapp');
        console.log(form, "...................................");


        // try {
        const response = await axios({
            url: 'https://graph.facebook.com/v22.0/565830889949112/media',
            method: 'POST',
            headers: {
                Authorization: `Bearer EAAao8Mkc6lMBO4ZBZCpNMgpI1VlJxdZAXpMTJx9B3VOM815fYZAAZAxAwymnZAEYsSAh0hUdHQiA379ZANpw7MAcxNrCx2PZB395yZCygcgkg1UUhSLqkydbgHntnKVLBFbiYWdie4sYtHcONuCf40mkbUbbhKq20zCvtm1TI33ZC5uesjt15PlZAHTs4P4hQu4SEkdyFPeIyVtBA9eZCYzafrroBWSh5TOHIMVh5OsZD`,
                'Content-Type': 'multipart/form-data',
            },
            data: form,
        });


        return "response.data.id";
        // } catch (error) {
        //   throw new Error(`Failed to upload file to WhatsApp: ${error.response?.data?.error?.message || error.message}`);
        // }
    }

    async sendMediaMessage() {
        const response = await this.whatsappApiPost({
            "messaging_product": "whatsapp",
            "to": "917202031718",
            "type": "image",
            "image": {
                "link": "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
                "caption": "this is image https://chatgpt.com/c/6814731d-1ac0-800c-8eb7-a83c5b6573a8"
            }
        })
        console.log(response.data, response.data.messages, response.data.contacts);
        return "response"
    }

}



