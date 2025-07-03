import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios, { AxiosResponse } from "axios"
import { Template } from "./template.entity";
import cron from 'node-cron';
import { TemplateRequestInput } from "./dto/TemplateRequestInputDto";
import { instantsService } from "../instants/instants.service";
import fs from 'fs/promises';
import { MailingListService } from "../mailingList/mailingList.service";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';


@Injectable()
export class TemplateService {
    private templateRepository: Repository<Template>

  constructor(
          @Inject(CONNECTION) connection: Connection,

    private workspaceService: WorkspaceService,
    private readonly instantsService: instantsService,
    private readonly mailingListService: MailingListService,

      ) {
        this.templateRepository = connection.getRepository(Template);
      }

  async submitTemplate(templateData: TemplateRequestInput, workspaceId: string): Promise<any> {
    const findSelectedInstants = await this.instantsService.findInstantsByInstantsId(templateData.account)
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const businessId = findSelectedInstants?.businessAccountId
    const accessToken = findSelectedInstants?.accessToken
    const variablesValue = templateData.variables.map((variable: any) => variable.value)

    const payload = {
      name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
      category: templateData.category,
      language: templateData.language,
      components: [
        templateData.header_handle && templateData.headerType == 'TEXT' && {
          type: 'HEADER',
          format: 'TEXT',
          text: templateData.header_handle
        },
        templateData.headerType && templateData.headerType == 'IMAGE' && {
          type: 'HEADER',
          format: 'IMAGE',
          example: {
            header_handle: [templateData.header_handle]
          }
        },
        templateData.headerType && templateData.headerType == 'VIDEO' && {
          type: 'HEADER',
          format: 'VIDEO',
          example: {
            header_handle: [templateData.header_handle]
          }
        },
        templateData.headerType && templateData.headerType == 'DOCUMENT' && {
          type: 'HEADER',
          format: 'DOCUMENT',
          example: {
            header_handle: [templateData.header_handle]
          }
        },
        {
          type: 'BODY',
          text: templateData.bodyText,
          example: {
            body_text: [variablesValue]
          }
        },
        templateData.footerText && {
          type: 'FOOTER',
          text: templateData.footerText
        },
        templateData.button && {
          type: 'BUTTONS',
          buttons: templateData.button
          // buttons: [{ type: 'QUICK_REPLY', text: templateData.buttonText }]
        }
      ].filter(Boolean)
    };




    try {
      const response = await axios({
        url: `https://graph.facebook.com/v22.0/${businessId}/message_templates`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ ...payload })
      });

      const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
      if (!workspace) throw new Error("workspace doesnt found")

      const templateAPiResponse = response.data

      if (templateAPiResponse.success || templateAPiResponse.id) {
        const templateCreation = this.templateRepository.create({
          templateId: templateAPiResponse.id,
          status: templateAPiResponse.status.toLowerCase(),
          ...templateData,
          // workspace
        })

        await this.templateRepository.save(templateCreation)

        this.getTemplateStatusByCron(templateAPiResponse.id, workspaceId)
        return {
          success: true,
          data: response.data,
        };
      }
    } catch (error) {
      console.log({
        success: false,
        error: error.response?.data || error.message,
      });
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }

  }

  async getTemplateStatusByCron(templateId: string, workspaceId: string) {
    const findSelectedInstants = await this.instantsService.FindSelectedInstants(workspaceId)
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const accessToken = findSelectedInstants?.accessToken
    const templateByApi = await this.getTemplateStatusByWhatsappApi(templateId, accessToken);

    const templateFromDb = await this.findTemplateByTemplateId(templateId);

    if (!templateFromDb) throw new Error("template error from database")


    if (templateByApi && templateByApi.data.status.toLowerCase() === 'approved') {
      templateFromDb.status = 'approved'
      await this.templateRepository.save(templateFromDb)
      return {
        success: true,
        data: templateByApi.data,
      };
    }

    try {
      if (templateByApi && templateByApi.data.status.toLowerCase() == 'pending') {
        const taskTemplateStatus = cron.schedule('*/10 * * * * *', async () => {

          if (templateByApi.data.status.toLowerCase() === 'approved') {
            taskTemplateStatus.stop();
            templateFromDb.status = 'approved'
            await this.templateRepository.save(templateFromDb)
            return {
              success: true,
              data: templateByApi.data,
            };
          }
        });

        taskTemplateStatus.start();
      }
    } catch (error) {
      console.error("this error is from Cron", error);
      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  async getTemplateStatusByWhatsappApi(templateId: string, accessToken: string): Promise<any> {
    try {
      const response = await axios({
        // url: `https://graph.facebook.com/v22.0/1649375815967023/message_templates?template_id=${templateId}`,
        url: `https://graph.facebook.com/v22.0/${templateId}?fields=name,status,category,language,components`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error({
        success: false,
        error: error.response?.data || error.message,
      });

      return {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }





  async getAllTemplates() {
    const url = `https://graph.facebook.com/v22.0/467842749737629/message_templates`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer EAAL391PN5tABOxIYkjT5MS0XG1467ookiRaAdsZC7j1i5zXelAUdRwAvlg8hqwcZB9i5bzvfsD37VU4wCPZBOPndgCZBUyiTsFxl6eKVce9ZCzyXcUSOjKg3zlOfJlfm9swpyNrJf8DDNZCljA5kE6SEwwV8H8A4DsMWGJZAfCaZCiD9wkyZCxva6iTjDNxPj04ZBhrEzsnEnqWoMfaScRss0ZB8Dqf6O5s26Woi5ayov2VIwZAHt1mZA`,
        },
      });

      const templates = response;
      console.log(response.data.data, '.............................');

      return "fsds"
    } catch (err) {
      console.error('Error fetching templates:', err.response?.data || err.message);
      return "fsds"
    }

  }



  async findAllTemplate(workspaceId: string): Promise<Template[]> {
    return await this.templateRepository.find({
      // where: { workspace: { id: workspaceId } },
      order: { createdAt: 'ASC' }
    })
  }

  async findTemplateByTemplateId(templateId: string) {
    return await this.templateRepository.findOne({ where: { templateId } })
  }


  async uploadFile(file, appId, accessToken) {
    const { filename, mimetype, path, size }: any = file;
    const buffer = await fs.readFile(path)
    const uploadSessionRes = await axios.post(
      `https://graph.facebook.com/v22.0/${appId}/uploads`,
      null,
      {
        params: {
          file_name: filename,
          file_length: size,
          file_type: mimetype,
          access_token: `${accessToken}`,
        },
      }
    );
    const response = await axios({
      url: `https://graph.facebook.com/v22.0/${uploadSessionRes.data.id}`,
      method: 'POST',
      headers: {
        Authorization: `OAuth ${accessToken}`,
        file_offset: 0
      },
      data: {
        'data-binary': buffer
      }
    });
    return response.data.h
  }


  async SyncAllTemplats(workspaceId, businessAccountId, accessToken) {
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
      const components = template.components || [];

      const header = components.find((c) => c.type === 'HEADER');
      const body = components.find((c) => c.type === 'BODY');
      const footer = components.find((c) => c.type === 'FOOTER');
      const buttonsComponent = components.find((c) => c.type === 'BUTTONS');

      const variableList: { name: string; value: string }[] = [];
      if (body?.example?.body_text?.[0]) {
        body.example.body_text[0].forEach((_, index) => {
          variableList.push({ name: `{{${index + 1}}}`, value: '' });
        });
      }

      const buttons = buttonsComponent?.buttons?.map((btn) => ({
        type: btn.type,
        text: btn.text,
        url: btn.url,
        phone_number: btn.phone_number
      })) || [];

      const newTemplate = this.templateRepository.create({
        account: businessAccountId,
        templateName: template.name,
        status: template.status || 'UNKNOWN',
        templateId: template.id,
        category: template.category || 'UNKNOWN',
        language: template.language || 'en_US',
        headerType: header?.format || null,
        bodyText: body?.text || null,
        footerText: footer?.text || null,
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
  }


}

