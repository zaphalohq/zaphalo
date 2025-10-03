import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Connection, Repository, ILike } from 'typeorm';
import axios from 'axios';
import crypto from "crypto";
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { dirname, join } from 'path';

import { WhatsAppAccount } from 'src/customer-modules/whatsapp/entities/whatsapp-account.entity';
import { WhatsAppTemplate, TemplateStatus } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { WhatsAppMessage } from 'src/customer-modules/whatsapp/entities/whatsapp-message.entity';
import { AttachmentService } from 'src/customer-modules/attachment/attachment.service';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WaAccountDto } from '../dtos/whatsapp-account-update.dto';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { FileService } from 'src/modules/file-storage/services/file.service';
import { WhatsAppSDKService } from 'src/customer-modules/whatsapp/services/whatsapp-api.service';


export const SUPPORTED_ATTACHMENT_TYPE = {
  "audio": ["audio/aac", "audio/mp4", "audio/mpeg", "audio/amr", "audio/ogg"],
  "document": [
    'text/plain', 'application/pdf', 'application/vnd.ms-powerpoint', 'application/msword',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  'image': ['image/jpeg', 'image/png'],
  'video': ['video/mp4',],
}

@Injectable()
export class WaAccountService {
  private waAccountRepository: Repository<WhatsAppAccount>
  private templateRepository: Repository<WhatsAppTemplate>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsService: ContactsService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly whatsAppApiService: WhatsAppSDKService,
    private readonly fileService: FileService,
    private readonly attachmentService: AttachmentService,
  ) {
    this.waAccountRepository = connection.getRepository(WhatsAppAccount);
    this.templateRepository = connection.getRepository(WhatsAppTemplate);
  }

  async WaAccountCreate(req, waAccount: WaAccountDto): Promise<WhatsAppAccount> {
    const waAccounts = await this.waAccountRepository.find();
    let defaultWaAccount = false;
    if (waAccounts.length < 1) {
      defaultWaAccount = true
    }
    const whatappInstants = this.waAccountRepository.create({
      name: waAccount.name,
      appId: waAccount.appId,
      phoneNumberId: waAccount.phoneNumberId,
      businessAccountId: waAccount.businessAccountId,
      accessToken: waAccount.accessToken,
      appSecret: waAccount.appSecret,
      defaultSelected: defaultWaAccount,
    })
    await this.contactsService.createContacts({
      contactName: waAccount.name,
      phoneNo: Number(waAccount.phoneNumberId),
      defaultContact: true,
    })

    const waAccountSaved = await this.waAccountRepository.save(whatappInstants)
    const waWebhookToken = this.encodeWaWebhookToken({ sub: req.user.userId, workspaceId: req.user.workspace, waAccount })
    waAccountSaved.waWebhookToken = waWebhookToken
    await this.waAccountRepository.save(waAccountSaved)

    return waAccountSaved;
  }

  async WaAccountSave(updatedInstants: WaAccountDto): Promise<WhatsAppAccount | null> {
    const id = updatedInstants.accountId;
    const waAccount = await this.waAccountRepository.findOne({ where: { id } });
    if (!waAccount) {
      throw new NotFoundException(`Instant with ID ${id} not found`);
    }
    Object.assign(waAccount, updatedInstants);
    await this.waAccountRepository.save(waAccount);
    return waAccount
  }


  async findAllAccounts(): Promise<WhatsAppAccount[]> {
    return await this.waAccountRepository.find({
      order: { createdAt: 'ASC' }
    });
  }

  async searchReadAccounts(
    page: number = 1,
    pageSize: number = 10,
    search: string = '',
  ) {
    const skip = (page - 1) * pageSize;

    const where: any = {};

    // Search (by name)
    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [accounts, total] = await this.waAccountRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { createdAt: 'DESC' },
    })

    return {
      accounts,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    }
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
    if (!instantsId){
      return null
    }
    return await this.waAccountRepository.findOne({
      where: { id: instantsId },
    });
  }
  async getWaAccountPhoneAndAccountId(phoneNumberId: string, businessAccountId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { phoneNumberId: phoneNumberId, businessAccountId: businessAccountId },
    });
  }

  async findInstantsByAccounID(businessAccountId: string): Promise<WhatsAppAccount | null> {
    return await this.waAccountRepository.findOne({
      where: { businessAccountId: businessAccountId },
    });
  }

  encodeWaWebhookToken(payloadToEncode: Record<string, any>) {
    const secret = this.jwtWrapperService.generateAppSecret(
      'API_KEY',
      payloadToEncode.workspaceId
    );

    const signedPayload = this.jwtWrapperService.sign(
      {
        ...payloadToEncode,
      },
      {
        secret,
        expiresIn: '100y'
      },
    );

    return signedPayload;
  }


  async getWhatsAppApi(instantsId?: string) {
    if (instantsId) {
      const instants = await this.findInstantsByInstantsId(instantsId)
      if (!instants)
        throw new Error("Not found whatsappaccount")
      return this.whatsAppApiService.getWhatsApp(instants)
    } else {
      const findTrueInstants = await this.FindSelectedInstants()
      if (!findTrueInstants)
        throw new Error("Not found whatsappaccount")

      return this.whatsAppApiService.getWhatsApp(findTrueInstants)
    }
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

  async saveSyncTemplates(templates, instants) {
    const dbTemplates = await this.templateRepository.find();
    const arrWaTempalteIds = dbTemplates.map((template) => template.waTemplateId)
    for (const template of templates) {
      if (!arrWaTempalteIds.includes(template.id)) {
        const components = template.components || [];
        const componentData: any = this.convertTemplatePayloadToDbData(components)
        const dbTemplate = this.templateRepository.create({
          account: instants,
          name: template.name,
          templateName: template.name,
          status: TemplateStatus[template.status.toLowerCase()],
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

  async prepareAttachmentVals(attachment, waAccount){
    // """ Upload the attachment to WhatsApp and return prepared values to attach to the message. """
    let whatsappMediaType = ''

    for (const [key, value] of Object.entries(SUPPORTED_ATTACHMENT_TYPE)) {
      if (value.includes(attachment.mimetype)){
        whatsappMediaType = key
        break
      }
    }

    if (!whatsappMediaType)
      throw new Error(`Attachment mimetype is not supported by WhatsApp: ${attachment.mimetype}.`)
    const waApi = await this.getWhatsAppApi(waAccount.id)
    let whatsappMediaUid = await waApi.uploadWhatsappDocument(attachment)

    let vals = {
      'type': whatsappMediaType,
      [whatsappMediaType]: {'id': whatsappMediaUid}
    }
    if (whatsappMediaType == 'document')
      vals[whatsappMediaType]['filename'] = attachment.name

    return vals
  }

  async readWaAccount(
    search?: string,
    limit?: number,
  ) {
    const waAccounts = await this.waAccountRepository.find({
      where: { name: ILike(`%${search}%`) },
      order: { createdAt: 'ASC' },
      take: limit,
    });
    return waAccounts;
  }
}