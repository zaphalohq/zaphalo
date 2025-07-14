import axios from 'axios';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WhatsAppAccount } from '../entities/whatsapp-account.entity';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { WaAccountUpdateDTO } from '../dtos/whatsapp-account-update.dto';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

@Injectable()
export class WaAccountService {
  private waAccountRepository: Repository<WhatsAppAccount>
  private waTemplateRepository: Repository<WhatsAppTemplate>
  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsService: ContactsService,
    ) {
    this.waAccountRepository = connection.getRepository(WhatsAppAccount);
    this.waTemplateRepository = connection.getRepository(WhatsAppTemplate);
  }

  async WaAccountCreate(WhatsappInstantsData: WaAccountUpdateDTO): Promise<WhatsAppAccount> {
    const waAccounts = await this.waAccountRepository.find();
    let defaultWaAccount = false;
    if (waAccounts.length < 1) {
      defaultWaAccount = true
    }
    const whatappInstants = this.waAccountRepository.create({
      name: WhatsappInstantsData.name,
      appId: WhatsappInstantsData.appId,
      phoneNumberId: WhatsappInstantsData.phoneNumberId,
      businessAccountId: WhatsappInstantsData.businessAccountId,
      accessToken: WhatsappInstantsData.accessToken,
      appSecret: WhatsappInstantsData.appSecret,
      defaultSelected: defaultWaAccount
    })
    await this.contactsService.createContacts({
      contactName: WhatsappInstantsData.name,
      phoneNo: Number(WhatsappInstantsData.phoneNumberId),
      defaultContact: true,
    })
    await this.waAccountRepository.save(whatappInstants)
    return whatappInstants;
  }

  async SyncTemplate(instants: any, businessAccountId: string, accessToken: string): Promise<any> {
    const response = await axios.get(
  `https://graph.facebook.com/v22.0/${businessAccountId}/message_templates`,
  {
    headers: { Authorization: `Bearer ${accessToken}` },
  }
  );
    const templates = response.data?.data;

    for (const template of templates) {
      console.log(template,'..........................');

      const components = template.components || [];
            // const header = components.find((component) => component.type === 'HEADER');
            // const body = components.find((component) => component.type === 'BODY');
            // const footer = components.find((component) => component.type === 'FOOTER');
            // const buttonsComponent = components.find((component) => component.type === 'BUTTONS');

            // const variableList: { name: string; value: string }[] = [];
            // if (body?.example?.body_text?.[0]) {
            //     body.example.body_text?.[0].forEach((variable, index) => {
            //         variableList.push({ name: `{{${index + 1}}}`, value: variable });
            //     });
            // }

            // const buttons = buttonsComponent?.buttons?.map((btn) => ({
            //     type: btn.type,
            //     text: btn.text,
            //     url: btn.url,
            //     phone_number: btn.phone_number
            // }));

      const newTemplate = this.waTemplateRepository.create({
        account: instants?.id,
        templateName: template.name,
        status: template.status,
        templateId: template.id,
        category: template.category,
        language: template.language,
        rawComponents: components
                // bodyText: body?.text,
                // footerText: footer?.text,
                // header_handle: header?.example?.header_handle?.[0]?.handle || null,
                // button: buttons,
                // variables: variableList,
      });
      await this.waTemplateRepository.save(newTemplate);
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
      return {
        success: false,
        error: error?.response?.data?.error?.message || error.message
      };
    }
  };

  async findAllAccounts(): Promise<WhatsAppAccount[]> {
    return await this.waAccountRepository.find({
      order: { createdAt: 'ASC' }
    });
  }

  async UpdateInstants(id: string, updatedInstants: WaAccountUpdateDTO): Promise<WhatsAppAccount | null> {
    const existingInstants = await this.waAccountRepository.findOne({ where: { id } });
    if (!existingInstants) {
      throw new NotFoundException(`Instant with ID ${id} not found`);
    }
    Object.assign(existingInstants, updatedInstants);
    const existingContact = await this.contactsService.findOneContact(Number(existingInstants.phoneNumberId))
    if(!existingContact) throw Error("contact not found")
      await this.contactsService.UpdateContact({
        id: existingContact?.id,
        contactName: existingContact?.contactName,
        phoneNo: Number(updatedInstants?.phoneNumberId)
      })
    return this.waAccountRepository.save(existingInstants);
  }

  async DeleteInstants(id: string): Promise<WhatsAppAccount | null> {
    const deleteInstants = await this.waAccountRepository.findOne({ where: { id } });
    if (deleteInstants)
      return await this.waAccountRepository.remove(deleteInstants)
    else
      return null

  }

  async InstantsSelection(instantsId: string) {
    const findSelectedInstants = await this.FindSelectedInstants()

    await this.waAccountRepository.update(
      { id: findSelectedInstants?.id },
      { defaultSelected: false }
      )
    await this.waAccountRepository.update(
      { id: instantsId },
      { defaultSelected: true }
      )
    return await this.findAllAccounts()
  }


  async FindSelectedInstants() {
    return this.waAccountRepository.findOne({
      where: { defaultSelected: true }
    });
  }

  async findInstantsByPhoneNoId(phoneNumberId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { phoneNumberId: phoneNumberId },
    });
  }

  async findInstantsByInstantsId(instantsId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { id: instantsId },
    });
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
    const url = `https://graph.facebook.com/v23.0/420599511140821/messages`;

        // const payload = {
        //     messaging_product: 'whatsapp',
        //     to: 917202031718,
        //     type: 'template',
        //     template: {
        //         name: 'order_template',
        //         language: { code: 'en_US' },
        //         components: [
        //             {
        //                 type: 'body',
        //                 parameters: [
        //                     {
        //                         type: 'text',
        //                         text: 'Chintan Patel' //replaces {{1}} in the body and URL
        //                     }
        //                 ]
        //             }
        //         ]
        //     }
        // };

    const payload = {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": "+917202031718",
      "type": "text",
      "text": {
        "preview_url": true,
        "body": "As requested, here'\''s the link to our latest product: https://www.meta.com/quest/quest-3/"
      },
    }

    try {
      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer EAAL391PN5tABPKLO53Q8q9Dw5IPnnXos13G4Ao2lkf1vIp0YiuVFP2NwtAJltD8V7cnba8AdOTZBCMLuzN3Eu9D77R5eC0tqWVxKyFexDOOcNlwfDSIbLB1lZCnJaKz6jYRFrzT8JZAdvZAOzoc3icFva7C2p03XQVpexknoqxwmzJAIYaZBK76cRk7I0VrQg1asREuU78JxN5cByxber77ZCFYohbzu3aajO6jv0X`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Message sent:', response.data);
    } catch (error) {
      console.error('Send message failed:', error.response?.data || error.message);
    }
    return "response"

  }

}