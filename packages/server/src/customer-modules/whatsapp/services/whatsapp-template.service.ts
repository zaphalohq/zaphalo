import axios from "axios";
import cron from 'node-cron';
import path from 'path';
import fs from 'fs/promises';
import { Connection, In, Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService } from "./whatsapp-account.service";
import { Attachment } from "src/customer-modules/attachment/attachment.entity";
import { Account } from "aws-sdk";
import { WhatsAppAccount } from "../entities/whatsapp-account.entity";
import { log } from "util";


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
    let account: WhatsAppAccount | null = null;
    if (instantsId) {
      account = await this.waAccountService.findInstantsByInstantsId(instantsId);
      if (!account) throw Error('template doesnt exist')
    }

    let attachment: Attachment | null = null;

    if (templateData.attachmentId) {
      attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId);
      if (!attachment) throw new Error('Attachment does not exist');
    }

    const template = this.templateRepository.create({
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

    if (account) {
      template.account = account
    }

    if (attachment) {
      template.templateImg = attachment.name;
      template.attachment = attachment;
    }


    await this.templateRepository.save(template);
    return template;
    // if (templateData.attachmentId) {
    //   const attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId)
    //   if (!attachment) throw Error('attachment doesnt exist')
    //   const newTemplate = this.templateRepository.create({
    //     account: account,
    //     templateName: templateData.templateName,
    //     status: 'saved',
    //     category: templateData.category,
    //     language: templateData.language,
    //     headerType: templateData.headerType,
    //     bodyText: templateData.bodyText,
    //     footerText: templateData.footerText,
    //     button: templateData.button,
    //     variables: templateData.variables,
    //     templateImg: attachment.name,
    //     attachment: attachment
    //   });
    //   await this.templateRepository.save(newTemplate);
    //   return newTemplate;
    // } else {
    //   const newTemplate = this.templateRepository.create({
    //     account: instantsId,
    //     templateName: templateData.templateName,
    //     status: 'saved',
    //     category: templateData.category,
    //     language: templateData.language,
    //     headerType: templateData.headerType,
    //     bodyText: templateData.bodyText,
    //     footerText: templateData.footerText,
    //     button: templateData.button,
    //     variables: templateData.variables,
    //   });
    //   await this.templateRepository.save(newTemplate);
    //   return newTemplate;
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
      template.attachment = attachment;
      template.templateImg = attachment.name;
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

  async getTemplateStatusByCron(waTemplateId: string) {
    const findSelectedInstants = await this.waAccountService.FindSelectedInstants();
    if (!findSelectedInstants) throw new Error('findSelectedInstants not found');

    const accessToken = findSelectedInstants.accessToken;
    const templateFromDb = await this.findTemplateByTemplateId(waTemplateId);
    if (!templateFromDb) throw new Error("template not found in database");

    const checkStatus = async () => {
      const templateByApi = await this.getTemplateStatusByWhatsappApi(waTemplateId, accessToken);
      const status = templateByApi?.data?.status?.toLowerCase();

      if (status === 'approved') {
        templateFromDb.status = 'approved';
        await this.templateRepository.save(templateFromDb);
        console.log('Template approved and saved in DB.');
        return true;
      }

      return false;
    };

    const immediateStatus = await checkStatus();
    if (immediateStatus) {
      return {
        success: true,
        message: 'Template approved immediately.',
      };
    }

    const task = cron.schedule('*/10 * * * * *', async () => {
      console.log('🔁 Running cron to check template status...');
      const approved = await checkStatus();

      if (approved) {
        task.stop();
      }
    });

    return {
      success: true,
      message: 'Started cron job to monitor template status every 10 seconds.',
    };
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

    async findAllApprovedTemplate(): Promise<WhatsAppTemplate[]> {
    return await this.templateRepository.find({
      where: { status : In(['APPROVED', 'approved'])},
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

  async saveSyncTemplates(templates, instants) {
    const dbTemplates = await this.templateRepository.find();
    const arrWaTempalteIds = dbTemplates.map((template) => template.waTemplateId)
    for (const template of templates) {
      if (!arrWaTempalteIds.includes(template.id)) {
        const components = template.components || [];
        const componentData: any = this.convertTemplatePayloadToDbData(components)
        const dbTemplate = this.templateRepository.create({
          account: instants,
          templateName: template.name,
          status: template.status,
          waTemplateId: template.id,
          language: template.language,
          category: template.category,
          headerType: componentData.headerType,
          headerText: componentData.headerText,
          bodyText: componentData.bodyText,
          footerText: componentData.footerText,
          button: componentData.button,
          variables: componentData.variables,
          templateImg: componentData.templateImg
        })
        await this.templateRepository.save(dbTemplate);
      }
    }

    return { success: 'template are synced' }
  }

  convertTemplatePayloadToDbData(components: any[]) {
    const dbComponent = {
      headerType: 'NONE',
      bodyText: '',
      footerText: '',
      button: [],
      headerText: '',
      templateImg: '',
      variables: []
    };

    for (const component of components) {
      switch (component.type) {
        case 'HEADER':
          dbComponent.headerType = component.format;
          if (component.format === 'TEXT') {
            dbComponent.headerText = component.text;
          } else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(component.format)) {
            dbComponent.templateImg = component.example?.header_handle?.[0] || '';
          }
          break;
        case 'BODY':
          dbComponent.bodyText = component.text;
          const variableValues = component.example?.body_text?.[0] || [];
          dbComponent.variables = variableValues.map((val: string, idx: number) => ({
            name: `{{${idx + 1}}}`,
            value: val
          }));
          break;
        case 'FOOTER':
          dbComponent.footerText = component.text;
          break;
        case 'BUTTONS':
          dbComponent.button = component.buttons;
          break;
      }
    }

    return dbComponent;
  }


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
      const buttons = templateData.button.map((btn: any, index: number) => {
        const { type, url, phone_number, text } = btn;

        switch (type) {
          case 'URL':
            return {
              type: 'button',
              sub_type: 'url',
              index: index.toString(),
              parameters: [{ type: 'text', text: url }],
            };
          case 'PHONE_NUMBER':
            return {
              type: 'button',
              sub_type: 'phone_number',
              index: index.toString(),
              parameters: [{ type: 'phone_number', phone_number }],
            };
          case 'QUICK_REPLY':
          default:
            return {
              type: 'button',
              sub_type: 'quick_reply',
              index: index.toString(),
              parameters: [{ type: 'payload', payload: text }],
            };
        }
      });

      components.push(...buttons);
    }


    console.log(components,'....componenst');
    
    return {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
        language: {
          code: templateData.language,
        },
        ...(variablesValue.length > 0 && components.length > 0 && { components }),
      },
    };
  }


}

