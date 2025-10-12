import { Inject, Injectable, Logger } from "@nestjs/common";
import { Connection, ILike, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService, SUPPORTED_ATTACHMENT_TYPE } from "./whatsapp-account.service";
import { WaTemplateService } from "./whatsapp-template.service";
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';


import { WhatsAppMessage, messageStates } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { WhatsAppTemplate, TemplateStatus } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { WhatsAppMessageCreatedEvent } from 'src/customer-modules/whatsapp/events/whatsapp-message-created.event';
import {
  WhatsAppException,
  WhatsAppExceptionCode,
} from 'src/customer-modules/whatsapp/whatsapp.exception';

@Injectable()
export class WaMessageService {
  private waMessageRepository: Repository<WhatsAppMessage>
  private waTemplateRepository: Repository<WhatsAppTemplate>
  protected readonly logger = new Logger(WaMessageService.name);


  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly waTemplateService: WaTemplateService,
    private eventEmitter: EventEmitter2
  ) {
    this.waMessageRepository = connection.getRepository(WhatsAppMessage);
    this.waTemplateRepository = connection.getRepository(WhatsAppTemplate);
  }



  async createWaMessage(workspaceId: string, whatsappMessageVal: any, forceSend: boolean = false){
    const waMessage = this.waMessageRepository.create({
      mobileNumber: whatsappMessageVal.mobileNumber,
      messageType: whatsappMessageVal.messageType,
      waAccountId: whatsappMessageVal.waAccountId,
      channelMessageId: whatsappMessageVal.channelMessageId,
      waTemplateId: whatsappMessageVal.waTemplateId,
      body: whatsappMessageVal.body,
      msgUid: whatsappMessageVal.msgUid,
    })
    const newWaMessage = await this.waMessageRepository.save(waMessage)
    if (!forceSend && !whatsappMessageVal.msgUid){
      const whatsAppMessageCreatedEvent = new WhatsAppMessageCreatedEvent();

      whatsAppMessageCreatedEvent.workspaceId = workspaceId
      whatsAppMessageCreatedEvent.messageId = newWaMessage.id

      this.eventEmitter.emit('whatsapp.message.created', whatsAppMessageCreatedEvent)
    }else{
      await this.sendWhatsappMessage(waMessage.id)
    }
    return waMessage
  }

  async sendWhatsappMessage(messageId: string): Promise<WhatsAppMessage | null | any> {
    const waMessage = await this.waMessageRepository.findOne({
      where: {id: messageId},
      relations: [
        'waAccountId',
        'channelMessageId',
        'channelMessageId.attachment',
        'waTemplateId',
        'waTemplateId.account',
        'waTemplateId.attachment',
      ]
    })

    if (!waMessage)
      return null
    try {
      const waApi = await this.waAccountService.getWhatsAppApi(waMessage.waAccountId.id)

      let parentMessageId = false
      let body = waMessage.body

      const number = waMessage.mobileNumber
      let messageType
      let sendVals
      if (!number)
        throw new WhatsAppException(
          'Invalid number',
          WhatsAppExceptionCode.MOBILE_NUMBER_NOT_VALID,
        );

      // based on template
      if (waMessage.waTemplateId){
        messageType = 'template'
        if (waMessage.waTemplateId.status != TemplateStatus.approved){
          // || waMessage.waTemplateId.quality == 'red'):
            throw new WhatsAppException(
              'Template is not approved',
              WhatsAppExceptionCode.TEMPLATE_NOT_APPROVED,
            );
        }
        // # generate sending values, components and attachments
        sendVals = await this.waTemplateService.getSendTemplateVals(
            waMessage?.waTemplateId,
        )
      }
      else if (waMessage.channelMessageId.attachment){
        let attachmentVals = await this.prepareAttachmentVals(waMessage.channelMessageId.attachment, waMessage.waAccountId)
        messageType = attachmentVals.type
        sendVals = attachmentVals[messageType]
        if (waMessage.body)
          sendVals['caption'] = body
      }else{
        messageType = 'text'
        sendVals = {
          "preview_url": true,
          "body": body,
        }
      }
      const msgUid = await waApi.sendWhatsApp(number, messageType, sendVals, parentMessageId)
      if (msgUid){
        Object.assign(waMessage, {state: messageStates['sent'], msgUid: msgUid})
      }else{
        Object.assign(waMessage, {state: messageStates['bounced']})
      }
      await this.waMessageRepository.save(waMessage)
      return waMessage
    } catch (err){
      Object.assign(waMessage, {state: messageStates['error'], failureReason: err.message ? err.message : err})
      await this.waMessageRepository.save(waMessage)
      this.logger.error(`WhatsApp message send error ${err}`)
    }
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
    const waApi = await this.waAccountService.getWhatsAppApi(waAccount.id)
    let whatsappMediaUid = await waApi.uploadWhatsappDocument(attachment)

    let vals = {
        'type': whatsappMediaType,
        [whatsappMediaType]: {'id': whatsappMediaUid}
    }

    if (whatsappMediaType == 'document')
      vals[whatsappMediaType]['filename'] = attachment.name

    return vals
  }
}