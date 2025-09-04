import { Inject, Injectable } from "@nestjs/common";
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


import { WhatsAppMessage } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { WhatsAppTemplate } from "src/customer-modules/whatsapp/entities/whatsapp-template.entity";
import { WhatsAppMessageCreatedEvent } from 'src/customer-modules/whatsapp/events/whatsapp-message-created.event';


@Injectable()
export class WaMessageService {
  private waMessageRepository: Repository<WhatsAppMessage>
  private waTemplateRepository: Repository<WhatsAppTemplate>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private readonly waTemplateService: WaTemplateService,
    private eventEmitter: EventEmitter2
  ) {
    this.waMessageRepository = connection.getRepository(WhatsAppMessage);
    this.waTemplateRepository = connection.getRepository(WhatsAppTemplate);
  }



  async createWaMessage(workspaceId: string, whatsappMessageVal: any){

    const waMessage = this.waMessageRepository.create({
      mobileNumber: whatsappMessageVal.mobileNumber,
      messageType: whatsappMessageVal.messageType,
      waAccountId: whatsappMessageVal.waAccountId,
      channelMessageId: whatsappMessageVal.channelMessageId,
      body: whatsappMessageVal.body,
      msgUid: whatsappMessageVal.msgUid,
    })
    const newWaMessage = await this.waMessageRepository.save(waMessage)

    const whatsAppMessageCreatedEvent = new WhatsAppMessageCreatedEvent();

    whatsAppMessageCreatedEvent.workspaceId = workspaceId
    whatsAppMessageCreatedEvent.messageId = newWaMessage.id
    // if (!whatsappMessageVal.msgUid){
    //   this.eventEmitter.emit('whatsapp.message.created', whatsAppMessageCreatedEvent)
    // }
    return waMessage
  }

  async sendWhatsappMessage(data: any): Promise<string | undefined> {
    const waMessage = await this.waMessageRepository.findOne({
      where: {id: data.messageId},
      relations: ['waAccountId', 'channelMessageId', 'channelMessageId.attachment',  'waTemplateId']
    })
    if (!waMessage)
      return "a"

    const waApi = await this.waAccountService.getWhatsAppApi(waMessage.waAccountId.id)

    let parentMessageId = false
    // body = html2plaintext(whatsapp_message.body)
    let body = waMessage.body

    // number = whatsapp_message.mobile_number_formatted
    const number = waMessage.mobileNumber
    let messageType
    let sendVals
    if (!number)
      throw Error("Invalid number")

    // const messagePayload = await this.generateMessagePayload(waMessage);

    // based on template
    if (waMessage.waTemplateId){
      messageType = 'template'
      if (waMessage.waTemplateId.status != 'APPROVED'){
        // || waMessage.waTemplateId.quality == 'red'):
          throw new Error("Template is not approved")
      }
      // waMessage.messageType = 'outbound'

      // # generate sending values, components and attachments
      const values = this.waTemplateService.getSendTemplateVals(
          waMessage?.waTemplateId,
          waMessage,
      )
      sendVals = values[0]
      console.log("...........values.......sendVals............", values);
      // let send_vals = values[0]
      let attachment = values[1]
      // # reports are considered always unique
      // if (not template.report_id){
      //     send_vals_without_attachments = dict(send_vals)
      //     // # the same attachment re-uploaded will have a different identifier
      //     // # TODO MASTER avoid having to upload as part of the "get template values" flow
      //     if template.header_type in ('image', 'video', 'document'):
      //         components = [component_vals for component_vals in send_vals['components'] if component_vals['type'] != 'header']
      //         send_vals_without_attachments['components'] = components
      //     unique_message_vals = (number, frozendict(send_vals_without_attachments))
      //     if unique_message_vals not in sent_message_vals:
      //         sent_message_vals.add(unique_message_vals)
      //     else:
      //         is_duplicate = True
      // }
      // if (attachment && attachment not in waMessage.mail_message_id.attachment_ids)
      //     // # Clone the attachment to ensure the template's attachment is not affected by message changes
      //     cloned_attachment = attachment.copy({'res_model': whatsapp_message.mail_message_id.model, 'res_id': whatsapp_message.mail_message_id.res_id})
      //     whatsapp_message.mail_message_id.attachment_ids = [(4, cloned_attachment.id)]
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
    console.log("........................sendVals.............", sendVals)
    // const msg_uid = waApi.sendWhatsApp(number, messageType, sendVals, parentMessageId)


    // console.log("..................messagePayload............", messagePayload);

    // const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    // if (!findTrueInstants)
    //   throw new Error("Not found whatsappaccount")


    // const waMessageIds: string[] = [];

    // for (const receiver of receiverId) {

    //   const finalPayload = {
    //     messaging_product: 'whatsapp',
    //     to: receiver,
    //     ...messagePayload,
    //   };



    //   const wa_api = await this.waAccountService.getWhatsAppApi();
    //   const message_id = await wa_api.sendWhatsApp(JSON.stringify(finalPayload));
    //   if (!message_id) throw new Error('Message not sent to WhatsApp');

    //   waMessageIds.push(message_id);
    // }

    // return waMessageIds;
    return "a"
  }

  // async generateMessagePayload(messageType, textMessage, attachmentUploadtoWaApiId?) {
  //   let messagePayload = {};

  //   if (messageType === 'text' && textMessage) {
  //     messagePayload = {
  //       type: 'text',
  //       text: {
  //         body: textMessage,
  //       },
  //     };
  //   } else if (messageType === 'image') {
  //     messagePayload = {
  //       type: 'image',
  //       image: {
  //         id: attachmentUploadtoWaApiId,
  //         caption: textMessage || '',
  //       },
  //     };
  //   } else if (messageType === 'document') {

  //     messagePayload = {
  //       type: 'document',
  //       document: {
  //         id: attachmentUploadtoWaApiId,
  //         filename: textMessage || 'file.pdf',
  //       },
  //     };
  //   } else if (messageType === 'video') {
  //     messagePayload = {
  //       type: 'video',
  //       video: {
  //         id: attachmentUploadtoWaApiId,
  //         caption: textMessage || '',
  //       },
  //     };
  //   } else if (messageType === 'audio') {
  //     messagePayload = {
  //       type: 'audio',
  //       audio: {
  //         id: attachmentUploadtoWaApiId,
  //       },
  //     };
  //   } else {
  //     throw new Error(`Unsupported message type: ${messageType}`);
  //   }

  //   return messagePayload;
  // }


  // async generateMessagePayload(waMessage) {
  //   let messagePayload = {};

  //   message_type = 'text'
  //   send_vals = {
  //       'preview_url': True,
  //       'body': body,
  //   }
  // }


  async prepareAttachmentVals(attachment, waAccount){
    // """ Upload the attachment to WhatsApp and return prepared values to attach to the message. """

    let whatsappMediaType = ''

    for (const [key, value] of Object.entries(SUPPORTED_ATTACHMENT_TYPE)) {
      console.log(`Key: ${key}, Value: ${value}`);
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