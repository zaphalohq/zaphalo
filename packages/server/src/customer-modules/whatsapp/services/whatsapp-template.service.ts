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
  TemplateQuality
} from "../entities/whatsapp-template.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WhatsAppSDKService } from './whatsapp-api.service'
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService, SUPPORTED_ATTACHMENT_TYPE } from "./whatsapp-account.service";
import { Attachment } from "src/customer-modules/attachment/attachment.entity";
import { Account } from "aws-sdk";
import { WhatsAppAccount } from "../entities/whatsapp-account.entity";
import { TestTemplateOutput, WaTestTemplateInput } from "src/customer-modules/whatsapp/dtos/test-input.template.dto";
import { FileUploadService } from "src/modules/file/services/file-upload.service";
import { FileFolder } from 'src/modules/file/interfaces/file-folder.interface';

import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { Button } from "../entities/whatsapp-template-button.entity";
import { Variable } from "../entities/whatsapp-template-variable.entity";
import { TemplateResponse } from "../dtos/templates/template-response.dto";
import { Broadcast } from "src/customer-modules/broadcast/entities/broadcast.entity";
import { broadcastStates } from "src/customer-modules/broadcast/enums/broadcast.state.enum";
import { MailingContacts } from "src/customer-modules/mailingList/mailingContacts.entity";
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
  private templateButtonRepository: Repository<Button>
  private templateVariablesRepository: Repository<Variable>
  private broadcastRepository: Repository<Broadcast>
  private mailingContactRepository: Repository<MailingContacts>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly attachmentService: AttachmentService,
    private fileUploadService: FileUploadService,
  ) {
    this.templateRepository = connection.getRepository(WhatsAppTemplate);
    this.templateButtonRepository = connection.getRepository(Button)
    this.templateVariablesRepository = connection.getRepository(Variable)
    this.broadcastRepository = connection.getRepository(Broadcast)
    this.mailingContactRepository = connection.getRepository(MailingContacts)
  }

  async createTemplate(templateData) {
    if (!templateData.whatsappAccountId) throw new Error('Template Whatsapp Account ID invalid!');

    const account = await this.waAccountService.findInstantsByInstantsId(templateData.whatsappAccountId);
    if (!account) throw Error("Whatsapp account doesn't found!")

    if(templateData.category==="AUTHENTICATION" && templateData.buttons.length>0){
      throw new Error("Authentication template doesn't have buttons")
    }

    if (templateData.headerType === 'TEXT' && !templateData.headerText){
      throw new Error('Header text is required')
    }

    if (templateData.headerType === 'TEXT' && templateData.headerText.length>60){
      throw new Error('Header text should be minimum 60 charatacter')
    }

    if(templateData.footerText.length>60){
      throw new Error('Footer text should be minimum 60 charatacter')
    }

    let attachment: Attachment | null = null;

    if (templateData.attachmentId) {
      attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId);
      if (!attachment) throw new Error("Attachment doesn't found!");
    }

    const buttons = templateData.buttons?.map((btn) => {
      return this.templateButtonRepository.create({
        type: btn.type,
        text: btn.text,
        url: btn.url || null,
        phone_number: btn.phone_number || null
      })
    }) || []

    //sort variable by name for facebook variable maping
    const sortedVariables = (templateData.variables || []).sort((a, b) => {
        const reg = /^\{\{(\d+)\}\}$/;

        const matchA = a.name.match(reg);
        const matchB = b.name.match(reg);

        // If both match pure {{number}}
        if (matchA && matchB) {
            return Number(matchA[1]) - Number(matchB[1]);
        }

        // If only A is numeric → A comes first
        if (matchA) return -1;

        // If only B is numeric → B comes first
        if (matchB) return 1;

        // Neither numeric → keep original order (no sorting)
        return 0;
    });

    const variables = sortedVariables?.map((v) => {

      if (!v.name) throw new Error('Variable name is required.');

      if (!v.type || !['STATIC', 'DYNAMIC'].includes(v.type)) {
        throw new Error(`Invalid variable type for ${v.name}. Must be 'static' or 'dynamic'.`);
      }

      if (v.type === 'STATIC') {
        if (!v.value)
          throw new Error(`Static variable ${v.name} must have a value.`);
      } else if (v.type === 'DYNAMIC') {
        if (!v.dynamicField)
          throw new Error(`Dynamic variable ${v.name} must have a dynamicField (e.g. name, number, etc).`);
      }


      return this.templateVariablesRepository.create({
        name: v.name,
        type: v.type,
        value: v.value || null,
        dynamicField: v.dynamicField || null,
        sampleValue: v.sampleValue || null,
      });
    }) || [];

    const template = this.templateRepository.create({
      name: slugify(templateData.templateName),
      templateName: templateData.templateName,
      category: templateData.category,
      language: templateData.language,
      headerType: templateData.headerType,
      bodyText: templateData.bodyText,
      footerText: templateData.footerText,
      buttons,
      variables,
      account: account,
    });

    if (attachment) {
      template.templateImg = attachment.path;
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

    if(templateData.category==="AUTHENTICATION" && templateData.buttons.length>0){
      throw new Error("Authentication template doesn't have buttons")
    }

    if (templateData.headerType === 'TEXT' && !templateData.headerText){
      throw new Error('Header text is required')
    }

    const buttons = templateData.buttons?.map((btn) => {
      return this.templateButtonRepository.create({
        type: btn.type,
        text: btn.text,
        url: btn.url || null,
        phone_number: btn.phone_number || null
      })
    }) || []

      //sort variable by name for facebook template's variable maping
    const sortedVariables = (templateData.variables || []).sort((a, b) => {
        const reg = /^\{\{(\d+)\}\}$/;

        const matchA = a.name.match(reg);
        const matchB = b.name.match(reg);

        // If both match pure {{number}}
        if (matchA && matchB) {
            return Number(matchA[1]) - Number(matchB[1]);
        }

        // If only A is numeric → A comes first
        if (matchA) return -1;

        // If only B is numeric → B comes first
        if (matchB) return 1;

        // Neither numeric → keep original order (no sorting)
        return 0;
    });

    const variables = sortedVariables?.map((v) => {

      if (!v.name) throw new Error('Variable name is required.');

      if (!v.type || !['STATIC', 'DYNAMIC'].includes(v.type)) {
        throw new Error(`Invalid variable type for ${v.name}. Must be 'static' or 'dynamic'.`);
      }

      if (v.type === 'STATIC') {
        if (!v.value)
          throw new Error(`Static variable ${v.name} must have a value.`);
      } else if (v.type === 'DYNAMIC') {
        if (!v.dynamicField)
          throw new Error(`Dynamic variable ${v.name} must have a dynamicField (e.g. name, number, etc).`);
      }


      return this.templateVariablesRepository.create({
        name: v.name,
        type: v.type,
        value: v.value || null,
        dynamicField: v.dynamicField || null,
        sampleValue: v.sampleValue || null,
      });
    }) || [];



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
      buttons,
      variables,
    })

    if (templateData.attachmentId) {
      const attachment = await this.attachmentService.findOneAttachmentById(templateData.attachmentId)
      if (!attachment) throw Error('attachment doesnt exist')
      templateFind.template.attachment = attachment;
      templateFind.template.templateImg = attachment.path;
    }

    await this.templateRepository.save(templateFind.template);
    return {'template': templateFind.template, 'message': 'Broadcast saved', 'status': true}
  }

  async getHeaderComponent(waTemplateId, freeTextJson, templateVariablesValue, attachment, workspaceId){
    // """ Prepare header component for sending WhatsApp template message"""
    let header = {}
    const headerType = waTemplateId.headerType
    
    // if(headerType == 'TEXT'){
    //   var value= waTemplateId.headerText
    //    header = {
    //     'type': 'header',
    //     'parameters': [{'type': 'text', 'text': value}]
    //   }
    // }
    if(['IMAGE', 'VIDEO', 'DOCUMENT'].includes(headerType)){
      header = {
        "type": 'header',
        "parameters": [await this.waAccountService.prepareAttachmentVals(attachment, waTemplateId.account, workspaceId)]
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
    if (!LATITUDE_LONGITUDE_REGEX.test(`${latitude}, ${longitude}`)){
      new Error(`Location Latitude and Longitude ${latitude} / ${longitude} is not in proper format.`)
    }
  }

  async getBodyComponent(waTemplateId, mobileNumber) {
    if (!waTemplateId.variables || waTemplateId.variables.length === 0){
      return undefined;
    }
    let parameters: any[] = []

    const mailingContact = await this.mailingContactRepository.findOne(
      {
        where: {
          contactNo: mobileNumber
        }
      }
    )

    for (const v of waTemplateId.variables) {

      // ---------- STATIC VARIABLE ----------
      if (v.type === "STATIC") {
        parameters.push({
          type: "text",
          text: v.value || ""
        });
      }

      // ---------- DYNAMIC VARIABLE ----------
      else if (v.type === "DYNAMIC") {
        let dynamicValue = null;

        if (v.dynamicField) {
          switch (v.dynamicField.toLowerCase()) {

            case "name":
              dynamicValue = mailingContact?.contactName || v.sampleValue || "";
              break;

            case "number":
              dynamicValue = mailingContact?.contactNo || mobileNumber || "";
              break;

            default:
              dynamicValue = v.sampleValue || "";
              break;
          }
        }
        else {
          dynamicValue = v.sampleValue || "";

        }

        parameters.push({
          type: "text",
          text: dynamicValue
        });
      }
    }

    return {
      type: "body",
      parameters: parameters
    };
  }

  getButtonComponents(waTemplateId, freeTextJson, templateVariablesValue){
    // """ Prepare button component for sending WhatsApp template message"""
    let components: any[] = []
    return components
  }

  async getSendTemplateVals(waTemplateId, mobileNumber, workspaceId){
    const freeTextJson = {}
    let attachment

    attachment = waTemplateId?.attachment

    let components: any[] = []
    let templateVariablesValue: any[] = [];

    const variables = waTemplateId?.variables || [];

    for (const variable of variables) {
      templateVariablesValue[variable.name] =
        variable.type === "STATIC"
          ? variable.value || " "
          : variable.sampleValue || " ";
    }


    // # generate content
    const header = await this.getHeaderComponent(waTemplateId, freeTextJson, templateVariablesValue, attachment, workspaceId)

    let body = await this.getBodyComponent(waTemplateId, mobileNumber)

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
    if (waTemplateId.headerType == 'TEXT' && waTemplateId.headerText){
      headComponent['text'] = waTemplateId.headerText
    }

    else if(['IMAGE', 'VIDEO', 'DOCUMENT'].includes(waTemplateId.headerType)){
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

    let body_params: any[] = []
    for (const variable of waTemplateId.variables) {
      let bodyVal;
      if(variable.type==='STATIC'){
        bodyVal=variable.value || ''
      }else{
        bodyVal=variable.sampleValue || ''
      }
      body_params.push(bodyVal)
    }
    if (body_params.length > 0){
      body_component['example'] = {'body_text': [body_params]}
    }
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
    if(buttons.length>0)
      return {'type': 'BUTTONS', 'buttons': buttons}
    return false

  }

  getTemplateFooterComponent(waTemplateId){
    if (!waTemplateId.footer_text){
      return false
    }
    return {'type': 'FOOTER', 'text': waTemplateId.footerText}
  }

  async submitTemplate(templateId) {

    // """Register template to WhatsApp Business Account """
    const waTemplate = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['account', 'attachment','variables','buttons'],
    })
    if (!waTemplate) throw Error("template doesn't exist")

    if (!waTemplate.category){
      throw new Error("Template category is missing")
    }

    const waApi = await this.waAccountService.getWhatsAppApi(waTemplate.account.id)

    let attachment;

    if (['IMAGE', 'VIDEO', 'DOCUMENT'].includes(waTemplate.headerType)){
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
        throw new Error("Whats app demo document not uploaded")
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
        const response = await waApi.submitTemplateNew(jsonData)
        if (response.success){
          Object.assign(waTemplate, {
            'waTemplateId': response.data.id,
            'status': TemplateStatus.pending,
          });
          await this.templateRepository.save(waTemplate);
        }
      }
      return {'template': waTemplate, 'message': 'Template submited', 'status': true}

    }
    catch (error){
      return {'template': waTemplate, 'message': error, 'status': false}
    }
  }

  async testTemplate(testTemplateData: WaTestTemplateInput, workspaceId){
    const template: any = await this.getTemplate(testTemplateData.dbTemplateId)
    if (!template?.template){
      throw Error("template doesn't exist")
    }
    const messageType = 'template'

    const waApi = await this.waAccountService.getWhatsAppApi(template.template.account.id)

    const sendVals = await this.getSendTemplateVals(template.template, testTemplateData.testPhoneNo, workspaceId)

    const msgUid = await waApi.sendWhatsApp(testTemplateData.testPhoneNo, messageType, sendVals)

    return { success: 'test template send successfully' }
  }

  async getTemplate(
    templateId: string,
  ) {
    const templateFind = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ["account", "attachment", "buttons", "variables"],
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
      relations: ["account", "attachment", "buttons", "variables"],
    });

    return {
      templates,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    };
  }

  async syncTemplate(
    workspaceId: string,
    templateId: string,
  ) {
    const templateFind = await this.getTemplate(templateId)
    if (!templateFind?.template){
      throw Error("template doesn't exist")
    }
    if (!templateFind?.template?.account) throw Error("Whatsapp account doesn't found!")

    if (!templateFind.template.waTemplateId) throw Error("Whatsapp temlate uid doesn't found!")

    const waAPI = await this.waAccountService.getWhatsAppApi(templateFind.template.account.id)
    let data;
    try{
      data = await waAPI.getTemplateData(templateFind.template.waTemplateId)
    }
    catch (error){
      console.log(error)
    }
    if (data['id']){
      await this.updateTemplateFromResponse(workspaceId, templateFind.template, data)
    }
    return {'template': templateFind.template, 'message': 'Template updated', 'status': true}
  }


  async updateTemplateFromResponse(workspaceId, waTemplate, remoteTemplateVals){
    const templateVals = await this.getTemplateValsFromResponse(workspaceId, remoteTemplateVals, waTemplate.account)

    let updateVals = {
      "bodyText": templateVals["body"],
      "headerType": templateVals["headerType"],
      "headerText": templateVals["headerText"],
      "footerText": templateVals["footerText"],
      "language": templateVals["language"],
      "category": templateVals["category"],
      "status": templateVals['status'],
      "quality": templateVals['quality'],
    }
    if (!waTemplate.attachment && templateVals['fileHandle']){
      const newAttachment = await this.createTemplateAttachment(workspaceId, templateVals['fileHandle'])
      if (newAttachment){
        updateVals['attachment'] = newAttachment
        updateVals['templateImg'] = newAttachment.name
      }
    }
    Object.assign(waTemplate, updateVals)
      await this.templateRepository.save(waTemplate);
    return true
  }

  async createTemplateAttachment(workspaceId, fileResponse){
    if (fileResponse){
      const mimeType = fileResponse.mimeType
      const extension = mime.extension(mimeType) || '';
      const filename = `${uuidv4()}.${extension}`
      const fileData = fileResponse.data
      const file_size = fileResponse.file_size
      const now = new Date()

      const file = await this.fileUploadService.uploadFile({
        file: fileData,
        filename: filename,
        mimeType: mimeType,
        fileFolder: FileFolder.Template,
        workspaceId: workspaceId
      })

      const attachement = await this.attachmentService.createOneAttachment({
        name: filename,
        originalname: filename,
        size: Buffer.from(fileData).length,
        mimetype: mimeType,
        path: file.path,
        createdAt: now,
        updatedAt: now
      })

      return attachement
    }
    return false
  }

  async getTemplateValsFromResponse(workspaceId, remoteTemplateVals, waAccount){
    // """Get dictionary of field: values from whatsapp template response json.

    // Relational fields will use arrays instead of commands.
    // """
    const qualityScore = remoteTemplateVals['quality_score']['score'].toLowerCase()
    let templateVals = {
      'body': '',
      'footerText': '',
      'headerText': '',
      'headerType': TemplateHeaderType['NONE'],
      'language': TemplateLanguage[remoteTemplateVals['language']],
      'name': remoteTemplateVals['name'].replace("_", " ").toLowerCase(),
      'quality': TemplateQuality[qualityScore == 'unknown' ? 'none' : qualityScore],
      'status': TemplateStatus[remoteTemplateVals['status'].toLowerCase()],
      'templateName': remoteTemplateVals['name'],
      'category': TemplateCategory[remoteTemplateVals['category']],
      'account': waAccount.id,
      'waTemplateId': remoteTemplateVals['id'],
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
        templateVals['headerType'] = TemplateHeaderType[component['format']]
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
            const waApi = await this.waAccountService.getWhatsAppApi(waAccount.id)
            const response = await waApi.getHeaderDataFromHandle(documentUrl)
            mimetype = response.headers['content-type']
            data = response.data
            extension = mime.extension(mimetype)
            templateVals['fileHandle'] = {
              'name': `${templateVals["templateName"]}.${extension}`,
              'data': data,
              'mimeType': mimetype,
            }
          }
          // else{
          //   const encoder = new TextEncoder();
          //   const data = encoder.encode('AAAA');
          //   const {extension, mimetype } = {
          //       'IMAGE': ['jpg', 'image/jpeg'],
          //       'VIDEO': ['mp4', 'video/mp4'],
          //       'DOCUMENT': ['pdf', 'application/pdf']
          //   }[component['format']]
          // }


        }
      }else if (componentType == 'BODY'){
        templateVals['body'] = component['text']
        const variableValues = component.example?.body_text?.[0] || [];
        templateVals['variables'] = variableValues.map((val: string, idx: number) => ({
          name: `{{${idx + 1}}}`,
          value: val
        }));
      }else if (componentType == 'FOOTER'){
        templateVals['footerText'] = component['text']
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

  async createTemplateFromResponse(workspaceId, remoteTemplateVals, waAccount){
    const templateVals = await this.getTemplateValsFromResponse(workspaceId, remoteTemplateVals, waAccount)
    if (templateVals['fileHandle']){
      const newAttachment = await this.createTemplateAttachment(workspaceId, templateVals['fileHandle'])
      if (newAttachment){
        templateVals['attachment'] = newAttachment
        templateVals['templateImg'] = newAttachment.name
      }
    }
    return templateVals
  }


  async syncWhatsAppAccountTemplates(workspaceId, waAccountId){
    const waAccount = await this.waAccountService.getWaAccount(waAccountId)
    if (!waAccount.waAccount){
      throw new Error("WhatsApp Account not found!")
    }

    try{
      const waApi = await this.waAccountService.getWhatsAppApi(waAccount.waAccount.id)
      const response = await waApi.getAllTemplate(true)
      const existingTmpls = await this.templateRepository.find({
        where: {account: {id: waAccount.waAccount.id}},
        relations: ['account', 'attachment'],
      })
      const existingTmplId: { [key: number]: string } = {};
      existingTmpls.forEach((template) => {
        if (template.waTemplateId !== null)
          existingTmplId[template.waTemplateId] = template
      })
      let templateUpdateCount = 0
      let templateCreateCount = 0
      if (response){
        for (const template of response) {
          const existingTmpl = existingTmplId[template['id']]
          if (existingTmpl){
            templateUpdateCount += 1
            await this.updateTemplateFromResponse(workspaceId, existingTmpl, template)
          }
          else{
            templateCreateCount += 1
            const createVals = await this.createTemplateFromResponse(workspaceId, template, waAccount.waAccount)
            const templateNew = await this.templateRepository.create(createVals)
            await this.templateRepository.save(templateNew);
          }
        }
      }
      return {'waAccount': waAccount.waAccount, 'message': 'WhatsApp account templates sync done.', 'status': true}
    }
    catch (error){
      return {'waAccount': waAccount.waAccount, 'message': 'WhatsApp account templates sync not done.', 'status': false}
    }
  }

  async deleteTemplate(templateIds: String[]): Promise<TemplateResponse> {
    const templates = await this.templateRepository.find({
      where: {
        id: In(templateIds)
      }
    })

    if (!templates.length) {
      return {
        status: false,
        message: 'No templates found with provided IDs.',
      };
    }

    const hasWaTemplate = templates.some(t => t.waTemplateId !== null);

    if (hasWaTemplate) {
      throw new Error('Cannot delete templates that are linked with WhatsApp Account.');
    }

    await this.templateRepository.remove(templates);

    return {
      'status': true,
      'message': 'Template deleted',
    }
  }
}


