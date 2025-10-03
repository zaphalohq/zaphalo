import axios from "axios";
import cron from 'node-cron';
import path from 'path';
import fs from 'fs/promises';
import * as mime from 'mime-types';
import { Connection, ILike, In, Repository } from 'typeorm';
import { Inject, Injectable } from "@nestjs/common";
import {
  WhatsAppTemplate,
  TemplateHeaderType,
  TemplateLanguage,
  TemplateCategory,
  TemplateStatus,
  TemplateQuality } from "../entities/whatsapp-template.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService, SUPPORTED_ATTACHMENT_TYPE } from "./whatsapp-account.service";
import { Attachment } from "src/customer-modules/attachment/attachment.entity";
import { Account } from "aws-sdk";
import { WhatsAppAccount } from "../entities/whatsapp-account.entity";
import { TestTemplateOutput, WaTestTemplateInput } from "src/customer-modules/whatsapp/dtos/test-input.template.dto";

const LATITUDE_LONGITUDE_REGEX = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;

function slugify(text: string): string {
  return text
    .toString() // Ensure the input is a string
    .normalize('NFD') // Decompose combined graphemes into separate ones
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase() // Convert the string to lowercase
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '_') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '_'); // Replace multiple hyphens with a single one
}


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

  async createTemplate(templateData) {
    if (!templateData.whatsappAccountId) throw new Error('Template Whatsapp Account ID invalid!');

    const account = await this.waAccountService.findInstantsByInstantsId(templateData.whatsappAccountId);
    if (!account) throw Error("Whatsapp account doesn't found!")

    let attachment: Attachment | null = null;

    if (templateData.attachmentId) {
      attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId);
      if (!attachment) throw new Error("Attachment doesn't found!");
    }

    const template = this.templateRepository.create({
      name: slugify(templateData.templateName),
      templateName: templateData.templateName,
      category: templateData.category,
      language: templateData.language,
      headerType: templateData.headerType,
      bodyText: templateData.bodyText,
      footerText: templateData.footerText,
      button: templateData.button,
      variables: templateData.variables,
      account: account,
    });

    if (attachment) {
      template.templateImg = attachment.name;
      template.attachment = attachment;
    }

    await this.templateRepository.save(template);
    return {'template': template, 'message': 'Template saved', 'status': true}
  }

  async updateTemplate(templateData) {
    if (!templateData.templateId) throw new Error('Template ID invalid!');
    if (!templateData.whatsappAccountId) throw new Error('Template Whatsapp Account ID invalid!');

    const templateFind = await this.getTemplate(templateData.templateId)
    if (!templateFind.template) throw Error("Template doesn't found!")
    
    const account = await this.waAccountService.findInstantsByInstantsId(templateData.whatsappAccountId);
    if (!account) throw Error("Whatsapp account doesn't found!")

    Object.assign(templateFind.template, {
      name: slugify(templateData.templateName),
      templateName: templateData.templateName,
      account: account,
      category: templateData.category,
      language: templateData.language,
      headerType: templateData.headerType,
      headerText: templateData.headerText,
      bodyText: templateData.bodyText,
      footerText: templateData.footerText,
      button: templateData.button,
      variables: templateData.variables,
    })

    if (templateData.attachmentId) {
      const attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId)
      if (!attachment) throw Error('attachment doesnt exist')
      templateFind.template.attachment = attachment;
      templateFind.template.templateImg = attachment.name;
    }

    await this.templateRepository.save(templateFind.template);
    return {'template': templateFind.template, 'message': 'Broadcast saved', 'status': true}
  }

  async getHeaderComponent(waTemplateId, freeTextJson, templateVariablesValue, attachment){
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
    else if(['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType)){
      header = {
        "type": 'header',
        "parameters": [await this.waAccountService.prepareAttachmentVals(attachment, waTemplateId.account.id)]
      }
    }
    else if(headerType == 'location'){
      header = {
          "type": "header",
          "parameters": [await this.prepareLocationVals(templateVariablesValue)]
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
    if (waTemplateId.variables.length == 0){
        return undefined
    }
    let parameters: any[] = []
    let free_text_count = 1
    for (const bodyVal of waTemplateId.variables)
    {
      parameters.push({
          'type': 'text',
          'text': bodyVal.value
      })
    }
    return {'type': 'body', 'parameters': parameters}
  }

  getButtonComponents(waTemplateId, freeTextJson, templateVariablesValue){
    // """ Prepare button component for sending WhatsApp template message"""
    let components: any[] = []
    return components
  }

  async getSendTemplateVals(waTemplateId){
    const freeTextJson = {}
    let attachment
      
    attachment = waTemplateId?.attachment

    let components: any[] = []
    const templateVariablesValue = waTemplateId?.variables?.map((v: any) => v.value) || [];

    // # generate content
    const header = await this.getHeaderComponent(waTemplateId, freeTextJson, templateVariablesValue, attachment)
    let body = await this.getBodyComponent(waTemplateId, freeTextJson, templateVariablesValue)
    let buttons = this.getButtonComponents(waTemplateId, freeTextJson, templateVariablesValue)
    if (Object.keys(header).length !== 0){
      components.push(header)
    }
    if (body){
      components.push(body)
    }
    // components = components & buttons

    let templateVals = {
        'name': slugify(waTemplateId.templateName),
        'language': {'code': waTemplateId.language},
    }

    if (components){
      templateVals['components'] = components
    }
    return templateVals
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

  getTemplateBodyComponent(waTemplateId){
    // """Return body component for template registration to whatsapp"""
    if (!waTemplateId.bodyText){
        return false
    }
    const body_component = {'type': 'BODY', 'text': waTemplateId.bodyText}

    // let body_params: any[] = []
    // for (const bodyVal of waTemplateId.variables){
    //   body_params.push(bodyVal.value)
    // }
    // if (body_params.length > 0){
    //   body_component['example'] = {'body_text': [body_params]}
    // }
    return body_component
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

  async submitTemplate(templateId){
        // """Register template to WhatsApp Business Account """
    const waTemplate = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['account', 'attachment'],
    })
    if (!waTemplate) throw Error("template doesn't exist")

    if (!waTemplate.category){
      throw new Error("Template category is missing")
    }

    const waApi = await this.waAccountService.getWhatsAppApi(waTemplate.account.id)

    let attachment;

    if (['image', 'video', 'document'].includes(waTemplate.headerType)){
      attachment = waTemplate.attachment
      if (!attachment){
        throw new Error("Header Document is missing")
      }
    }
    let fileHandle = false

    if (attachment){
      try{
        fileHandle = await waApi.uploadDemoDocument(attachment);
      }
      catch (error){
        throw new Error("Whats app demo dcument not uploaded")
      }
    }
    let components: any[] = [];
    const head = this.getTemplateHeadComponent(waTemplate, fileHandle)
    components = [this.getTemplateBodyComponent(waTemplate)]
    const buttons = this.getTemplateButtonComponent(waTemplate)
    const footer = this.getTemplateFooterComponent(waTemplate)

    if (head){
      components.push(head)
    }
    if (buttons){
      components.push(buttons)
    }
    if (footer){
      components.push(footer)
    }
    
    const jsonData = JSON.stringify({
        'name': slugify(waTemplate.templateName),
        'language': waTemplate.language,
        'category': waTemplate.category,
        'components': components,
    })
    try{
      if (waTemplate.waTemplateId){
        waApi.submitTemplateUpdate(jsonData, waTemplate.waTemplateId)
        Object.assign(waTemplate, {'status': TemplateStatus.pending});
        await this.templateRepository.save(waTemplate);
      }
      else{
        const response = waApi.submitTemplateNew(jsonData)
        Object.assign(waTemplate, {
          'waTemplateId': response['id'],
          'status': TemplateStatus.pending,
        });
        await this.templateRepository.save(waTemplate);
      }
      return {'template': waTemplate, 'message': 'Template submited', 'status': true}

    }
    catch (error){
      return {'template': waTemplate, 'message': error, 'status': false}
    }
  }

  async testTemplate(testTemplateData: WaTestTemplateInput){
    const template: any = await this.getTemplate(testTemplateData.dbTemplateId)
    if (!template?.template){
      throw Error("template doesn't exist")
    }
    const messageType = 'template'

    const wa_api = await this.waAccountService.getWhatsAppApi(template.template.account.id)

    const sendVals = await this.getSendTemplateVals(template.template)

    const waApi = await this.waAccountService.getWhatsAppApi(template.template.account.id)

    const msgUid = await waApi.sendWhatsApp(testTemplateData.testPhoneNo, messageType, sendVals)

    return { success: 'test template send successfully' }
  }

  async getTemplate(
    templateId: string,
  ) {
    const templateFind = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ["account", "attachment"],
    });
    if (!templateFind){
      throw new Error('Template not found');
    }
    return {'template': templateFind, 'message': 'Template found', 'status': true}
  }

  async readWaTemplate(
    search?: string,
    filter?: Record<string, any>,
    limit?: number,
  ) {
    let where = {}
    if (search){
     where = {templateName: ILike(`%${search}%`)};
    }
    if(filter){
      Object.assign(where, filter)
    }
    const waTemplates = await this.templateRepository.find({
      where: where,
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return waTemplates;
  }

  async searchReadTemplate(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
    filter: string = '',
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Search (by name)
    if (search) {
      where.templateName = ILike(`%${search}%`);
    }

    // Filter (by status)
    if (filter && filter !== 'All') {
      where.status = filter;
    }

    const [templates, total] = await this.templateRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: ["account", "attachment"],
    });

    return {
      templates,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async syncTemplate(
    templateId: string,
  ) {
    const templateFind = await this.getTemplate(templateId)
    if (!templateFind?.template){
      throw Error("template doesn't exist")
    }
    if (!templateFind?.template?.account) throw Error("Whatsapp account doesn't found!")

    const waAPI = await this.waAccountService.getWhatsAppApi(templateFind.template.account.id)
    let data;
    try{
      data = await waAPI.getTemplateData(templateFind.template.waTemplateId)
    }
    catch (error){
      console.log(error)
    }
    if (data['id']){
      this.updateTemplateFromResponse(templateFind.template, data)
    }
    return {'template': templateFind.template, 'message': 'Template updated', 'status': true}
  }


  async updateTemplateFromResponse(waTemplate, remoteTemplateVals){
      const templateVals = await this.getTemplateValsFromResponse(waTemplate, remoteTemplateVals, waTemplate.account)
      const updateVals = {
        "body": templateVals["body"],
        "header_type": TemplateHeaderType[templateVals["header_type"]],
        "header_text": templateVals["header_text"],
        "footer_text": templateVals["footer_text"],
        "lang_code": TemplateLanguage[templateVals["lang_code"]],
        "template_type": TemplateCategory[templateVals["template_type"]],
        "status": TemplateStatus[templateVals['status']],
        "quality": TemplateQuality[templateVals['quality']]
      }
      Object.assign(waTemplate, updateVals)
      await this.templateRepository.save(waTemplate);
      return true
  }

  async getTemplateValsFromResponse(waTemplate, remoteTemplateVals, waAccount){
        // """Get dictionary of field: values from whatsapp template response json.

        // Relational fields will use arrays instead of commands.
        // """

        const qualityScore = remoteTemplateVals['quality_score']['score'].toLowerCase()
        let templateVals = {
            'body': false,
            'footerText': false,
            'headerText': false,
            'attachment': false,
            'headerType': 'none',
            'language': remoteTemplateVals['language'],
            'name': remoteTemplateVals['name'].replace("_", " ").toLowerCase(),
            'quality': qualityScore == 'unknown' ? 'none' : qualityScore,
            'status': remoteTemplateVals['status'].toLowerCase(),
            'templateName': remoteTemplateVals['name'],
            'category': remoteTemplateVals['category'].toLowerCase(),
            'account': waAccount.id,
            'waTemplateId': parseInt(remoteTemplateVals['id']),
        }
        interface button {
          type: string;
          text: string;
          phone_number: string;
          url: string;
        }
        let buttons: button[] = []
        for (const component of remoteTemplateVals['components']){
            const componentType = component['type']
            if (componentType == 'HEADER'){
                templateVals['headerType'] = component['format'].toLowerCase()
                if (component['format'] == 'TEXT'){
                    templateVals['headerText'] = component['text']
                }
                else if (component['format'] == 'LOCATION'){
                    for (const locationVal of ['name', 'address', 'latitude', 'longitude']){
                      templateVals['variables'].push({
                          'name': locationVal,
                          'line_type': 'location',
                      })
                    }
                }
                else if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(component['format'])){
                  const documentUrl = component['example']?.header_handle ? component['example']?.header_handle[0] : false
                  let mimetype, extension, data;
                  if (documentUrl){
                    const waApi = await this.waAccountService.getWhatsAppApi(waTemplate.account.id)
                    const res = await waApi.getHeaderDataFromHandle(documentUrl)
                    extension = mime.extension(mimetype)
                  }
                  else{
                    const encoder = new TextEncoder();
                    const data = encoder.encode('AAAA');
                    const {extension, mimetype } = {
                        'IMAGE': ['jpg', 'image/jpeg'],
                        'VIDEO': ['mp4', 'video/mp4'],
                        'DOCUMENT': ['pdf', 'application/pdf']
                    }[component['format']]
                  }
                }
            }else if (componentType == 'BODY'){
              templateVals['body'] = component['text']
            }else if (componentType == 'FOOTER'){
              templateVals['footer_text'] = component['text']
            }else if (componentType == 'BUTTONS'){
              for (const [index, button] of component['buttons'].entries()){
                if (['URL', 'PHONE_NUMBER', 'QUICK_REPLY'].includes(button['type'])){
                  let buttonVals = {
                      'type': button['type'].toLowerCase(),
                      'text': button['text'],
                      'phone_number': button['phone_number'],
                      'url':button['url'] ? button['url'].replace('{{1}}', '') : false,
                  }
                  buttons.push(buttonVals)
                }
              }
            }
        }
        templateVals['button'] = buttons
        return templateVals
  }
}

