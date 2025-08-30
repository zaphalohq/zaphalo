import { Inject, Injectable } from "@nestjs/common";
import { Connection, ILike, In, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { WaAccountService } from "./whatsapp-account.service";
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { InjectMessageQueue } from 'src/modules/message-queue/decorators/message-queue.decorator';
import { MessageQueue } from 'src/modules/message-queue/message-queue.constants';


import { WhatsAppMessage } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { WhatsAppMessageCreatedEvent } from 'src/customer-modules/whatsapp/events/whatsapp-message-created.event';


@Injectable()
export class WaMessageService {
  private waMessageRepository: Repository<WhatsAppMessage>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly waAccountService: WaAccountService,
    private eventEmitter: EventEmitter2
  ) {
    this.waMessageRepository = connection.getRepository(WhatsAppMessage);
  }



  async createWaMessage(workspaceId: string, whatsappMessageVal: any){

    const waMessage = this.waMessageRepository.create({
      mobileNumber: whatsappMessageVal.mobileNumber,
      messageType: whatsappMessageVal.messageType,
      waAccountId: whatsappMessageVal.waAccountId,
      channelMessageId: whatsappMessageVal.channelMessageId,
      body: whatsappMessageVal.body
    })
    const newWaMessage = await this.waMessageRepository.save(waMessage)

    const whatsAppMessageCreatedEvent = new WhatsAppMessageCreatedEvent();

    whatsAppMessageCreatedEvent.workspaceId = workspaceId
    whatsAppMessageCreatedEvent.messageId = newWaMessage.id

    this.eventEmitter.emit('whatsapp.message.created', whatsAppMessageCreatedEvent);
    return waMessage
  }

  async sendWhatsappMessage(data: any): Promise<string> {
    const waMessage = await this.waMessageRepository.findOne({
      where: {id: data.messageId},
      relations: ['waAccountId']
    })
    if (!waMessage)
      return "a"

    const wa_api = await this.waAccountService.getWhatsAppApi(waMessage.waAccountId.id)

    let parent_message_id = false
    // body = html2plaintext(whatsapp_message.body)
    let body = waMessage.body

    // number = whatsapp_message.mobile_number_formatted
    let number = waMessage.mobileNumber

    if (!number)
      throw Error("Invalid number")

    // const messagePayload = await this.generateMessagePayload(waMessage);



    const message_type = 'text'
    const send_vals = {
      "preview_url": true,
      "body": body,
    }


    const msg_uid = wa_api.sendWhatsApp(number, message_type, send_vals, parent_message_id)


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

  
}