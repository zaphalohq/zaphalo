import axios from "axios";
import cron from 'node-cron';
import path from 'path';
import fs from 'fs/promises';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { WaTemplateRequestInput } from "../dtos/whatsapp.template.dto";
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'


@Injectable()
export class TemplateService {
  private templateRepository: Repository<WhatsAppTemplate>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
  ) {
    this.templateRepository = connection.getRepository(WhatsAppTemplate);
  }

  async submitTemplate(templateData: WaTemplateRequestInput): Promise<any> {
    const findSelectedInstants = await this.waAccountService.findInstantsByInstantsId(templateData.account)
    if (!findSelectedInstants)
      throw new Error("Whatsapp configration missing!")
    const wa_api = this.whatsAppApiService.getWhatsApp(findSelectedInstants)

    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const businessId = findSelectedInstants?.businessAccountId
    const accessToken = findSelectedInstants?.accessToken
    // const variablesValue = templateData.variables.map((variable: any) => variable.value)
    const payload = await this.generatePayload(templateData);

    // try {
    // const response = await axios({
    //   url: `https://graph.facebook.com/v22.0/${businessId}/message_templates`,
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   data: 
    // });
    const payload_json = JSON.stringify({ ...payload });
    const response = await wa_api.submitTemplateNew(payload_json)
    return response
    //   const templateAPiResponse = response.data

    //   if (templateAPiResponse.success || templateAPiResponse.id) {
    //     const templateCreation = this.templateRepository.create({
    //       templateId: templateAPiResponse.id,
    //       status: templateAPiResponse.status.toLowerCase(),
    //       ...templateData,
    //     })

    //     await this.templateRepository.save(templateCreation)

    //     this.getTemplateStatusByCron(templateAPiResponse.id)
    //     return {
    //       success: true,
    //       data: response.data,
    //     };
    //   }
    // } catch (error) {
    //   console.error({
    //     success: false,
    //     error: error.response?.data || error.message,
    //   });
    //   return {
    //     success: false,
    //     error: error.response?.data || error.message,
    //   };
    // }

  }

  async saveTemplate(templateData, instantsId) {
    const newTemplate = this.templateRepository.create({
      account: instantsId,
      templateName: templateData.name,
      status: 'saved',
      category: templateData.category,
      language: templateData.language,
      rawComponents: templateData.components
    });
    return await this.templateRepository.save(newTemplate);
  }

  async updateTemplate(updatetemplateData, dbTemplateId, instantsId?: string) {
    const template = await this.templateRepository.findOne({ where: { id: dbTemplateId } })
    if (!template) throw Error("template doesn't exist")
    if (instantsId) {
      template.account = instantsId;
    }
    template.templateId = updatetemplateData.id;
    template.status = updatetemplateData.status;
    template.category = updatetemplateData.category;
    console.log(template, 'updted temlate......................');

    await this.templateRepository.save(template);
    return template;
  }

  async generatePayload(templateData: WaTemplateRequestInput) {
    const variablesValue = templateData?.variables?.map((variable: any) => variable.value) || [];
    const payload = {
      name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
      category: templateData.category,
      language: templateData.language,
      components: [
        templateData.header_handle && templateData.headerType === 'TEXT' && {
          type: 'HEADER',
          format: 'TEXT',
          text: templateData.header_handle,
        },
        templateData.headerType === 'IMAGE' && {
          type: 'HEADER',
          format: 'IMAGE',
          example: {
            header_handle: [templateData.header_handle],
          },
        },
        templateData.headerType === 'VIDEO' && {
          type: 'HEADER',
          format: 'VIDEO',
          example: {
            header_handle: [templateData.header_handle],
          },
        },
        templateData.headerType === 'DOCUMENT' && {
          type: 'HEADER',
          format: 'DOCUMENT',
          example: {
            header_handle: [templateData.header_handle],
          },
        },
        {
          type: 'BODY',
          text: templateData.bodyText,
          ...(variablesValue.length > 0 && {
            example: {
              body_text: [variablesValue]
            }
          })
        },
        templateData.footerText && {
          type: 'FOOTER',
          text: templateData.footerText,
        },
        (templateData.button?.length ?? 0) > 0 && {
          type: 'BUTTONS',
          buttons: templateData.button,
        },
      ].filter(Boolean),
    };

    return payload;
  }

  async getTemplateStatusByCron(templateId: string) {
    const findSelectedInstants = await this.waAccountService.FindSelectedInstants()
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

      return "fsds"
    } catch (err) {
      console.error('Error fetching templates:', err.response?.data || err.message);
      return "fsds"
    }
  }

  async findAllTemplate(): Promise<WhatsAppTemplate[]> {
    return await this.templateRepository.find({
      order: { createdAt: 'DESC' }
    })
  }

  async findTemplateByTemplateId(templateId: string) {
    return await this.templateRepository.findOne({ where: { templateId } })
  }

  async uploadFile(url) {
    const response1 = await axios.get(url, { responseType: 'arraybuffer' });
    const filename = path.basename(url);
    const buffer = Buffer.from(response1.data);
    const mimetype = response1.headers['content-type'];
    const size = parseInt(response1.headers['content-length'] || `${buffer.length}`);
    // const { filename, mimetype, size, buffer }: any = file;
    // const buffer = await fs.readFile(path)

    const findSelectedInstants = await this.waAccountService.FindSelectedInstants()
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
    const appId = findSelectedInstants?.appId
    const accessToken = findSelectedInstants?.accessToken

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


  // async SyncAllTemplats(workspaceId, businessAccountId, accessToken) {
  //   const response = await axios.get(
  //     `https://graph.facebook.com/v22.0/${businessAccountId}/message_templates`,
  //     {
  //       headers: { Authorization: `Bearer ${accessToken}` },
  //     }
  //   );
  //   const templates = response.data?.data;
  //   for (const template of templates) {
  //     const components = template.components || [];
  //     const header = components.find((c) => c.type === 'HEADER');
  //     const body = components.find((c) => c.type === 'BODY');
  //     const footer = components.find((c) => c.type === 'FOOTER');
  //     const buttonsComponent = components.find((c) => c.type === 'BUTTONS');

  //     const variableList: { name: string; value: string }[] = [];
  //     if (body?.example?.body_text?.[0]) {
  //       body.example.body_text[0].forEach((_, index) => {
  //         variableList.push({ name: `{{${index + 1}}}`, value: '' });
  //       });
  //     }

  //     const buttons = buttonsComponent?.buttons?.map((btn) => ({
  //       type: btn.type,
  //       text: btn.text,
  //       url: btn.url,
  //       phone_number: btn.phone_number
  //     })) || [];

  //     const newTemplate = this.templateRepository.create({
  //       account: businessAccountId,
  //       templateName: template.name,
  //       status: template.status || 'UNKNOWN',
  //       templateId: template.id,
  //       category: template.category || 'UNKNOWN',
  //       language: template.language || 'en_US',
  //     });

  //     await this.templateRepository.save(newTemplate);
  //   }

  //   return {
  //     success: true,
  //     message: 'Templates imported successfully',
  //     count: templates.length
  //   };
  // }


}

