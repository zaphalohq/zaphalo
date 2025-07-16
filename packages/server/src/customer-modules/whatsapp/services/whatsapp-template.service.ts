import axios from "axios";
import cron from 'node-cron';
import path from 'path';
import fs from 'fs/promises';
import { Connection, Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService } from "./whatsapp-account.service";


@Injectable()
export class TemplateService {
  private templateRepository: Repository<WhatsAppTemplate>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly attachmentService: AttachmentService,

  ) {
    this.templateRepository = connection.getRepository(WhatsAppTemplate);
  }

  // async submitTemplate(templateData: WaTemplateRequestInput): Promise<any> {
  //   const findSelectedInstants = await this.waAccountService.findInstantsByInstantsId(templateData.accountId)
  //   if (!findSelectedInstants)
  //     throw new Error("Whatsapp configration missing!")
  //   const wa_api = this.whatsAppApiService.getWhatsApp(findSelectedInstants)

  //   if (!findSelectedInstants) throw new Error('findSelectedInstants not found');
  //   const businessId = findSelectedInstants?.businessAccountId
  //   const accessToken = findSelectedInstants?.accessToken
  //   // const variablesValue = templateData.variables.map((variable: any) => variable.value)
  //   const payload = await this.generatePayload(templateData);

  //   // try {
  //   // const response = await axios({
  //   //   url: `https://graph.facebook.com/v22.0/${businessId}/message_templates`,
  //   //   method: 'POST',
  //   //   headers: {
  //   //     Authorization: `Bearer ${accessToken}`,
  //   //     'Content-Type': 'application/json',
  //   //   },
  //   //   data: 
  //   // });
  //   const payload_json = JSON.stringify({ ...payload });
  //   const response = await wa_api.submitTemplateNew(payload_json)
  //   return response
  //   //   const templateAPiResponse = response.data

  //   //   if (templateAPiResponse.success || templateAPiResponse.id) {
  //   //     const templateCreation = this.templateRepository.create({
  //   //       templateId: templateAPiResponse.id,
  //   //       status: templateAPiResponse.status.toLowerCase(),
  //   //       ...templateData,
  //   //     })

  //   //     await this.templateRepository.save(templateCreation)

  //   //     this.getTemplateStatusByCron(templateAPiResponse.id)
  //   //     return {
  //   //       success: true,
  //   //       data: response.data,
  //   //     };
  //   //   }
  //   // } catch (error) {
  //   //   console.error({
  //   //     success: false,
  //   //     error: error.response?.data || error.message,
  //   //   });
  //   //   return {
  //   //     success: false,
  //   //     error: error.response?.data || error.message,
  //   //   };
  //   // }

  // }

  async saveTemplate(templateData, instantsId) {
    const account = await this.waAccountService.findInstantsByInstantsId(instantsId);
    console.log(account, "........account...................");

    if (!account) throw Error('template doesnt exist')
    if (templateData.attachmentId) {
      const attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId)
      if (!attachment) throw Error('attachment doesnt exist')
      const newTemplate = this.templateRepository.create({
        account: account,
        templateName: templateData.templateName,
        status: 'saved',
        category: templateData.category,
        language: templateData.language,
        headerType: templateData.headerType,
        bodyText: templateData.bodyText,
        footerText: templateData.footerText,
        button: templateData.button,
        variables: templateData.variables,
        attachment: attachment
      });
      await this.templateRepository.save(newTemplate);
      return newTemplate;
    } else {
      const newTemplate = this.templateRepository.create({
        account: instantsId,
        templateName: templateData.templateName,
        status: 'saved',
        category: templateData.category,
        language: templateData.language,
        headerType: templateData.headerType,
        bodyText: templateData.bodyText,
        footerText: templateData.footerText,
        button: templateData.button,
        variables: templateData.variables,
      });
      await this.templateRepository.save(newTemplate);
      return newTemplate;
    }





  }

  async updateTemplate(updatetemplateData, dbTemplateId, instantsId?: string) {
    const template = await this.templateRepository.findOne({ where: { id: dbTemplateId } })
    if (!template) throw Error("template doesn't exist")
    if (instantsId) {
      const account = await this.waAccountService.findInstantsByInstantsId(instantsId);
      if (!account) throw Error('template doesnt exist')
      template.account = account;
    }
    if (updatetemplateData.templateName) template.templateName = updatetemplateData.templateName;
    if (updatetemplateData.status) template.status = updatetemplateData.status;
    if (updatetemplateData.id) template.waTemplateId = updatetemplateData.id;
    if (updatetemplateData.category) template.category = updatetemplateData.category;
    if (updatetemplateData.language) template.language = updatetemplateData.language;
    if (updatetemplateData.headerType) template.headerType = updatetemplateData.headerType;
    if (updatetemplateData.headerText) template.headerText = updatetemplateData.headerText;
    if (updatetemplateData.bodyText) template.bodyText = updatetemplateData.bodyText;
    if (updatetemplateData.footerText) template.footerText = updatetemplateData.footerText;
    if (updatetemplateData.button) template.button = updatetemplateData.button;
    if (updatetemplateData.variables) template.variables = updatetemplateData.variables;
    if (updatetemplateData.attachmentId) {
      const attachment = await this.attachmentService.findOneAttachmentById(updatetemplateData.attachmentId)
      if (!attachment) throw Error('attachment doesnt exist')
      template.attachment = attachment
    }

    await this.templateRepository.save(template);
    return template;
  }

  async generatePayload(templateData: any, header_handle?: string) {
    const variablesValue = templateData?.variables?.map((variable: any) => variable.value) || [];
    const payload = {
      name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
      category: templateData.category,
      language: templateData.language,
      components: [
        templateData.headerType === 'TEXT' && {
          type: 'HEADER',
          format: 'TEXT',
          text: templateData.headerText,
        },
        templateData.headerType === 'IMAGE' && {
          type: 'HEADER',
          format: 'IMAGE',
          example: {
            header_handle: [header_handle],
          },
        },
        templateData.headerType === 'VIDEO' && {
          type: 'HEADER',
          format: 'VIDEO',
          example: {
            header_handle: [header_handle],
          },
        },
        templateData.headerType === 'DOCUMENT' && {
          type: 'HEADER',
          format: 'DOCUMENT',
          example: {
            header_handle: [header_handle],
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
      order: { createdAt: 'DESC' },
      relations: ["account", "attachment"]
    })
  }

  async findtemplateById(dbTemplateId: string): Promise<WhatsAppTemplate | null> {
    return await this.templateRepository.findOne({
      where: { id: dbTemplateId },
      relations: ["account", "attachment"]
    })
  }

  async findTemplateByTemplateId(waTemplateId: string) {
    return await this.templateRepository.findOne({ where: { waTemplateId } })
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


  async generateSendMessagePayload(templateData: any, recipientPhone: string, mediaLink?: string) {
    const variablesValue = templateData?.variables?.map((v: any) => v.value) || [];

    const components: any[] = [];

    if (templateData.headerType === 'IMAGE' && mediaLink) {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: {
              link: mediaLink,
            },
          },
        ],
      });
    } else if (templateData.headerType === 'VIDEO' && mediaLink) {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'video',
            video: {
              link: mediaLink,
            },
          },
        ],
      });
    } else if (templateData.headerType === 'DOCUMENT' && mediaLink) {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'document',
            document: {
              link: mediaLink,
            },
          },
        ],
      });
    } else if (templateData.headerType === 'TEXT') {
      components.push({
        type: 'header',
        parameters: [
          {
            type: 'text',
            text: templateData.headerText,
          },
        ],
      });
    }

    if (variablesValue.length > 0) {
      components.push({
        type: 'body',
        parameters: variablesValue.map((text: string) => ({
          type: 'text',
          text,
        })),
      });
    }

    if (templateData.button?.length > 0) {
      const buttons = templateData.button.map((btn: any, i: number) => {
        const base = {
          type: btn.type.toLowerCase(),
          index: i.toString(),
        };

        if (btn.type === 'URL') {
          return {
            ...base,
            sub_type: 'url',
            parameters: [{ type: 'text', text: btn.url }],
          };
        }

        if (btn.type === 'PHONE_NUMBER') {
          return {
            ...base,
            sub_type: 'phone_number',
            parameters: [{ type: 'phone_number', phone_number: btn.phone_number }],
          };
        }

        return base;
      });

      components.push({
        type: 'button',
        parameters: buttons,
      });
    }

    return {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
        language: {
          code: templateData.language,
        },
        ...(components.length > 0 && { components }),
      },
    };
  }


}

