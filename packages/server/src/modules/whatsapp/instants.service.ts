import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WhatsappInstants } from './Instants.entity';
import { Repository } from 'typeorm';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import axios from 'axios';
import { WorkspaceService } from '../workspace/workspace.service';
import { ContactsService } from '../contacts/contacts.service';
import fs from 'fs';

@Injectable()
export class instantsService {
    constructor(
        @InjectRepository(WhatsappInstants, 'core')                // Inject User repository
        private instantsRepository: Repository<WhatsappInstants>,
        private readonly workspaceService: WorkspaceService,
        private readonly contactsService: ContactsService,
    ) { }

    async CreateInstants(WhatsappInstantsData: CreateFormDataInput, workspaceId: string): Promise<WhatsappInstants | null> {
        console.log(WhatsappInstantsData);
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")

        const instants = await this.instantsRepository.find({ where: { id: workspaceId } });
        console.log(instants.length, "...............................");

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
            workspace,
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

    async findAllInstants(workspaceId: string): Promise<WhatsappInstants[]> {
        return await this.instantsRepository.find({
            where: { workspace: { id: workspaceId } },
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


    async FindSelectedInstants(workspaceId) {
        return this.instantsRepository.findOne({
            where: {
                defaultSelected: true,
                workspace: { id: workspaceId }
            }
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
                                text: 'Chintan Patel' //replaces {{1}} in the body and URL
                            }
                        ]
                    }
                ]
            }
        };

        try {
            const response = await axios.post(url, payload, {
                headers: {
                    Authorization: `Bearer EAAao8Mkc6lMBO1O4qgK3Bam1syGPZCTtLmcIXH7f9h4dthJKFI4cABSVjag1DUAlYer4BulPZBzLZAItLlxNaEZA4mXp1fnMCqTejFLieEZA6iWfXXmshbgxZCPedW9kHAZC1KTu77pNKFPQsPZBwQDjM7P2GYVw2qsbm9GZC2iierMlXAuTI1kUzKcP6LTqFkSPNGNaJ5XnfxWHeI0WbDsmmKTSBukTgw4jZAIxwZD`,
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
        console.log(form,"...................................");
        
      
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



