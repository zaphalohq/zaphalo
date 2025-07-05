import axios from 'axios';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WhatsappInstants } from './Instants.entity';
import { CreateFormDataInput } from './DTO/create-form-data.input';
import { Template } from 'src/customer-modules/template/template.entity';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

@Injectable()
export class instantsService {
            private instantsRepository: Repository<WhatsappInstants>
        private templateRepository: Repository<Template>
    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly contactsService: ContactsService,
      ) {
        this.instantsRepository = connection.getRepository(WhatsappInstants);
        this.templateRepository = connection.getRepository(Template);
      }

    async CreateInstants(WhatsappInstantsData: CreateFormDataInput): Promise<WhatsappInstants | null | string> {
        const instant = await this.instantsRepository.findOne({ 
            where: {phoneNumberId : WhatsappInstantsData.phoneNumberId}
            });
        if (instant) {
            return instant
        }

        const instants = await this.instantsRepository.find();

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
            defaultSelected: defaultSelected
        })
        await this.contactsService.createContacts({
            contactName: WhatsappInstantsData.name,
            phoneNo: Number(WhatsappInstantsData.phoneNumberId),
            defaultContact: true,
        })
        await this.instantsRepository.save(whatappInstants)
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
            return {
                success: false,
                error: error?.response?.data?.error?.message || error.message
            };
        }
    };

    async findAllInstants(): Promise<WhatsappInstants[]> {
        return await this.instantsRepository.find({
            order: { createdAt: 'ASC' }
        });
    }

    async UpdateInstants(id: string, updatedInstants: CreateFormDataInput): Promise<WhatsappInstants | null> {
        const existingInstants = await this.instantsRepository.findOne({ where: { id } });
        if (!existingInstants) {
            throw new NotFoundException(`Instant with ID ${id} not found`);
        }
        Object.assign(existingInstants, updatedInstants);
        return this.instantsRepository.save(existingInstants);
    }

    async DeleteInstants(id: string): Promise<WhatsappInstants | null> {
        const deleteInstants = await this.instantsRepository.findOne({ where: { id } });
        if (deleteInstants)
            return await this.instantsRepository.remove(deleteInstants)
        else
            return null

    }

    async InstantsSelection(instantsId: string) {
        const findSelectedInstants = await this.FindSelectedInstants()

        await this.instantsRepository.update(
            { id: findSelectedInstants?.id },
            { defaultSelected: false }
        )
        await this.instantsRepository.update(
            { id: instantsId },
            { defaultSelected: true }
        )
        return await this.findAllInstants()
    }


    async FindSelectedInstants() {
        return this.instantsRepository.findOne({
            where: { defaultSelected: true }
        });
    }

    async findInstantsByPhoneNoId(phoneNumberId: string): Promise<WhatsappInstants | null> {
        return await this.instantsRepository.findOne({
            where: { phoneNumberId: phoneNumberId},
        });
    }

    async findInstantsByInstantsId(instantsId: string): Promise<WhatsappInstants | null> {
        return await this.instantsRepository.findOne({
            where: { id: instantsId },
        });
    }

}



