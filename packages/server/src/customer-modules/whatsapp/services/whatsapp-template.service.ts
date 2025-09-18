import axios from "axios";
import cron from 'node-cron';
import path from 'path';
import fs from 'fs/promises';
import { Connection, ILike, In, Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import { WhatsAppTemplate } from "../entities/whatsapp-template.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService, SUPPORTED_ATTACHMENT_TYPE } from "./whatsapp-account.service";
import { Attachment } from "src/customer-modules/attachment/attachment.entity";
import { Account } from "aws-sdk";
import { WhatsAppAccount } from "../entities/whatsapp-account.entity";
import { FindAllTemplate } from "../dtos/findAllTemplate.dto";

const LATITUDE_LONGITUDE_REGEX = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

@Injectable()
export class WaTemplateService {
  private templateRepository: Repository<WhatsAppTemplate>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly attachmentService: AttachmentService,

  ) {
    this.templateRepository = connection.getRepository(WhatsAppTemplate);
  }

  async saveTemplate(templateData, instantsId) {
    let account: WhatsAppAccount | null = null;
    // if (instantsId) {
    //   account = await this.waAccountService.findInstantsByInstantsId(instantsId);
    //   if (!account) throw Error('template doesnt exist')
    // }

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

    // if (account) {
    //   template.account = account
    // }

    if (attachment) {
      template.templateImg = attachment.name;
      template.attachment = attachment;
    }


    await this.templateRepository.save(template);
    if (!templateData.noUpdateToWhatsapp){
      // this.submitTemplate(template);
    }
    return template;
  }



  async updateTemplate(updatetemplateData, dbTemplateId, instantsId?: string) {
    // const template = await this.templateRepository.findOne({
    //   where: { id: dbTemplateId },
    //   relations: ['account', 'attachment'],
    // })
    // if (!template) throw Error("template doesn't exist")
    // if (instantsId) {
    //   const account = await this.waAccountService.findInstantsByInstantsId(instantsId);
    //   if (!account) throw Error('template doesnt exist')
    //   template.account = account;
    // }
    // if (updatetemplateData.templateName) template.templateName = updatetemplateData.templateName;
    // if (updatetemplateData.status) template.status = updatetemplateData.status;
    // if (updatetemplateData.id) template.waTemplateId = updatetemplateData.id;
    // if (updatetemplateData.category) template.category = updatetemplateData.category;
    // if (updatetemplateData.language) template.language = updatetemplateData.language;
    // if (updatetemplateData.headerType) template.headerType = updatetemplateData.headerType;
    // if (updatetemplateData.headerText) template.headerText = updatetemplateData.headerText;
    // if (updatetemplateData.bodyText) template.bodyText = updatetemplateData.bodyText;
    // if (updatetemplateData.footerText) template.footerText = updatetemplateData.footerText;
    // if (updatetemplateData.button) template.button = updatetemplateData.button;
    // if (updatetemplateData.variables) template.variables = updatetemplateData.variables;
    // if (updatetemplateData.attachmentId) {
    //   const attachment = await this.attachmentService.findOneAttachmentById(updatetemplateData.attachmentId)
    //   if (!attachment) throw Error('attachment doesnt exist')
    //   template.attachment = attachment;
    //   template.templateImg = attachment.name;
    // }
    // await this.templateRepository.save(template);
    // if (!updatetemplateData.noUpdateToWhatsapp){
    //   this.submitTemplate(template);
    // }
    // return template;
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

  // async getTemplateStatusByCron(waTemplateId: string) {
  //   const findSelectedInstants = await this.waAccountService.FindSelectedInstants();
  //   if (!findSelectedInstants) throw new Error('findSelectedInstants not found');

  //   const accessToken = findSelectedInstants.accessToken;
  //   const templateFromDb = await this.findTemplateByWaTemplateId(waTemplateId);
  //   if (!templateFromDb) throw new Error("template not found in database");

  //   const checkStatus = async () => {
  //     const templateByApi = await this.getTemplateStatusByWhatsappApi(waTemplateId, accessToken);
  //     const status = templateByApi?.data?.status?.toLowerCase();

  //     if (status === 'approved') {
  //       templateFromDb.status = 'approved';
  //       await this.templateRepository.save(templateFromDb);
  //       return true;
  //     }

  //     return false;
  //   };

  //   const immediateStatus = await checkStatus();
  //   if (immediateStatus) {
  //     return {
  //       success: true,
  //       message: 'Template approved immediately.',
  //     };
  //   }

  //   const task = cron.schedule('*/10 * * * * *', async () => {
  //     console.log('Running cron to check template status...');
  //     const approved = await checkStatus();

  //     if (approved) {
  //       task.stop();
  //     }
  //   });

  //   return {
  //     success: true,
  //     message: 'Started cron job to monitor template status every 10 seconds.',
  //   };
  // }

  // async getTemplateStatusByWhatsappApi(templateId: string, accessToken: string): Promise<any> {
  //   try {
  //     const response = await axios({
  //       url: `https://graph.facebook.com/v22.0/${templateId}?fields=name,status,category,language,components`,
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     return {
  //       success: true,
  //       data: response.data,
  //     };
  //   } catch (error) {
  //     console.error({
  //       success: false,
  //       error: error.response?.data || error.message,
  //     });

  //     return {
  //       success: false,
  //       error: error.response?.data || error.message,
  //     };
  //   }
  // }


  async findAllTemplate(currentPage, itemsPerPage): Promise<FindAllTemplate> {
    const totalItems = await this.templateRepository.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage
    const allTemplates =  await this.templateRepository.find({
      order: { createdAt: 'DESC' },
      relations: ["account", "attachment"],
      skip: startIndex,
      take: itemsPerPage,
    })
    return { allTemplates, totalPages}
  }

  async findAllApprovedTemplate(): Promise<WhatsAppTemplate[]> {
    const waTemplates = await this.templateRepository.find({
      where: { status: In(['APPROVED', 'approved']) },
      order: { createdAt: 'DESC' },
      relations: ["account", "attachment"]
    })
    return waTemplates
  }

  async findtemplateByDbId(dbTemplateId: string): Promise<WhatsAppTemplate | null> {
    return await this.templateRepository.findOne({
      where: { id: dbTemplateId },
      relations: ["account", "attachment"]
    })
  }

  async findTemplateByWaTemplateId(waTemplateId: string) {
    return await this.templateRepository.findOne({
      where: { waTemplateId },
      relations: ['account', 'attachment']
    })
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

    return {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'template',
      template: {
        name: templateData.templateName.toLowerCase().replace(/\s/g, '_'),
        language: {
          code: templateData.language,
        },
        ...((variablesValue.length > 0 || ['IMAGE', 'VIDEO', 'DOCUMENT'].includes(templateData.headerType)) && components.length > 0 && { components }),
      },
    };
  }

  
  async searchedTemplate(
    searchTerm?: string,
  ) {
    const [broadcasts, totalCount] = await this.templateRepository.findAndCount({
      where: { templateName: ILike(`%${searchTerm}%`) },
      order: { createdAt: 'ASC' },
    });

    return { searchedData: broadcasts, totalCount };
  }

  getHeaderComponent(waTemplateId, freeTextJson, templateVariablesValue, attachment){
    // """ Prepare header component for sending WhatsApp template message"""
    let header = {}
    const headerType = waTemplateId.headerType
    if (headerType == 'text' && templateVariablesValue['header-{{1}}']){
      var value = (freeTextJson || {})['header_text'] || templateVariablesValue['header-{{1}}'] || ' '
      header = {
          'type': 'header',
          'parameters': [{'type': 'text', 'text': value}]
      }
    }
    else if(headerType in ['image', 'video', 'document']){
      header = {
        "type": "header",
        "parameters": [this.waAccountService.prepareAttachmentVals(attachment, waTemplateId.account.id)]
      }
    }
    else if(headerType == 'location'){
      header = {
          "type": "header",
          "parameters": [this.prepareLocationVals(templateVariablesValue)]
      }
    }
    return header
  }

  prepareLocationVals(templateVariablesValue){
    // """ Prepare location values for sending WhatsApp template message having header type location"""
    this.checkLocationLatitudeLongitude(templateVariablesValue['location-latitude'], templateVariablesValue['location-longitude'])
    return {
        'type': 'location',
        'location': {
            'name': templateVariablesValue['location-name'],
            'address': templateVariablesValue['location-address'],
            'latitude': templateVariablesValue['location-latitude'],
            'longitude': templateVariablesValue['location-longitude'],
        }
    }
  }

  checkLocationLatitudeLongitude(latitude, longitude){
    if (! LATITUDE_LONGITUDE_REGEX.test(`${latitude}, ${longitude}`)){
      new Error(`Location Latitude and Longitude ${latitude} / ${longitude} is not in proper format.`)
    }
  }

  getBodyComponent(waTemplateId, freeTextJson, templateVariablesValue){
    if (!waTemplateId.variables){
        return undefined
    }
    let parameters: any[] = []
    let free_text_count = 1
    console.log("..................waTemplateId...............", waTemplateId);
    for (const bodyVal of waTemplateId.variables)
    {
      parameters.push({
          'type': 'text',
          'text': bodyVal.value
      })
    }
    return {'type': 'body', 'parameters': parameters}
  }

  getSendTemplateVals(waTemplateId, waMessage){
    const freeTextJson = waMessage.freeTextJson
    let attachment = waMessage.channelMessageId.attachment

    let components: any[] = []
    const templateVariablesValue = waTemplateId?.variables?.map((v: any) => v.value) || [];

    // # generate content
    const header = this.getHeaderComponent(waMessage.waTemplateId, freeTextJson, attachment, templateVariablesValue)
    let body = this.getBodyComponent(waMessage.waTemplateId, freeTextJson, templateVariablesValue)
    if (Object.keys(header).length !== 0){
      components.push(header)
    }
    if (body){
      components.push(body)
    }
    let templateVals = {
        'name': waTemplateId.templateName,
        'language': {'code': waTemplateId.language},
    }
    if (components){
      templateVals['components'] = components
    }
    return [templateVals, attachment]
  }


  getTemplateBodyComponent(waTemplateId){
    // """Return body component for template registration to whatsapp"""
    if (!waTemplateId.bodyText){
        return false
    }
    const body_component = {'type': 'BODY', 'text': waTemplateId.bodyText}

    let body_params: any[] = []
    for (const bodyVal of waTemplateId.variables){
      body_params.push(bodyVal.value)
    }
    if (body_params.length > 0){
      body_component['example'] = {'body_text': [body_params]}
    }
    return body_component
  }

  getTemplateHeadComponent(waTemplateId, fileHandle){
    // """Return header component according to header type for template registration to whatsapp"""
    if (waTemplateId.headerType == 'NONE'){
      return false
    }

    let headComponent;
    headComponent = {'type': 'HEADER', 'format': waTemplateId.headerType}
    if (waTemplateId.headerType == 'text' && waTemplateId.headerText){
        headComponent['text'] = waTemplateId.header_text
    }

    else if(['image', 'video', 'document'].includes(waTemplateId.headerType)){
      headComponent['example'] = {
          'header_handle': [fileHandle]
      }
    }
    return headComponent
  }

  getTemplateButtonComponent(waTemplateId){
    // """Return button component for template registration to whatsapp"""
    if (!waTemplateId.buttons){
      return false
    }
    let buttons: any[] = []
    for (const button of waTemplateId.buttons) {
      var buttonData = {
        'type': button.type,
        'text': button.text
      }
      if (button.type == 'URL'){
        buttonData['url'] = button.website_url
      }else if (button.type == 'PHONE_NUMBER'){
        buttonData['phone_number'] = button.phone_number
      }
      buttons.push(buttonData)
    }
    return {'type': 'BUTTONS', 'buttons': buttons}
  }

  getTemplateFooterComponent(waTemplateId){
    if (!waTemplateId.footer_text){
      return false
    }
    return {'type': 'FOOTER', 'text': waTemplateId.footerText}
  }

  // async submitTemplate(waTemplate){
  //       // """Register template to WhatsApp Business Account """
  //   if (!waTemplate.category){
  //     throw new Error("Template category is missing")
  //   }
  //   console.log("...............waTemplate.............", waTemplate);
  //   const waApi = await this.waAccountService.getWhatsAppApi(waTemplate.account.id)

  //   let attachment = false
  //   if (['image', 'video', 'document'].includes(waTemplate.headerType)){
  //     attachment = waTemplate.attachment
  //     if (!attachment){
  //       throw new Error("Header Document is missing")
  //     }
  //   }
  //   let fileHandle = false
  //   if (attachment){
  //     try{
  //       fileHandle = await waApi.uploadDemoDocument(attachment);
  //     }
  //     catch (error){
  //       throw new Error("Whats app demo dcument not uploaded")
  //     }
  //   }
  //   let components: any[] = [];
  //   components = [this.getTemplateBodyComponent(waTemplate)]
  //   const head = this.getTemplateHeadComponent(waTemplate, fileHandle)
  //   const buttons = this.getTemplateButtonComponent(waTemplate)
  //   const footer = this.getTemplateFooterComponent(waTemplate)

  //   if (head){
  //     components.push(head)
  //   }
  //   if (buttons){
  //     components.push(buttons)
  //   }
  //   if (footer){
  //     components.push(footer)
  //   }
    
  //   const jsonData = JSON.stringify({
  //       'name': waTemplate.templateName,
  //       'language': waTemplate.language,
  //       'category': waTemplate.category,
  //       'components': components,
  //   })
  //   console.log("................jsonData...................", jsonData)
  //   try{
  //     if (waTemplate.waTemplateId){
  //       waApi.submitTemplateUpdate(jsonData, waTemplate.waTemplateId)
  //       // Object.assign(waTemplate, {'status': 'pending'});
  //       await this.templateRepository.save(waTemplate);
  //     }
  //     else{
  //       const response = waApi.submitTemplateNew(jsonData)
  //       Object.assign(waTemplate, {
  //         'waTemplateId': response['id'],
  //         'status': response['status']
  //       });
  //       await this.templateRepository.save(waTemplate);
  //     }
  //   }
  //   catch (error){
  //     return {"success": false, "error": error}
  //   }
  // }

    async readWaTemplate(
      search?: string,
      limit?: number,
    ) {
      const waTemplates = await this.templateRepository.find({
        where: { templateName: ILike(`%${search}%`) },
        order: { createdAt: 'ASC' },
        take: limit,
      });
      return waTemplates;
    }

}

