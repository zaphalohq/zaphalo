import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';

import axios from 'axios';
import crypto from "crypto";
import * as mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';
import { dirname, join } from 'path';

import { WhatsAppAccount } from 'src/customer-modules/whatsapp/entities/whatsapp-account.entity';
import { WhatsAppTemplate } from 'src/customer-modules/whatsapp/entities/whatsapp-template.entity';
import { messageStates, WhatsAppMessage } from 'src/customer-modules/whatsapp/entities/whatsapp-message.entity';
import { WaAccountDto } from 'src/customer-modules/whatsapp/dtos/whatsapp-account-update.dto';
import { WaAccountService } from 'src/customer-modules/whatsapp/services/whatsapp-account.service';

import { AttachmentService } from 'src/customer-modules/attachment/attachment.service';
import { ChannelService } from 'src/customer-modules/channel/services/channel.service';
import { Channel } from 'src/customer-modules/channel/entities/channel.entity';
import { MessageReaction } from 'src/customer-modules/channel/entities/message-reaction.entity';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { FileUploadService } from 'src/modules/file/services/file-upload.service';
import { FileFolder } from 'src/modules/file/interfaces/file-folder.interface';
import { ChannelMessageState, Message } from 'src/customer-modules/channel/entities/message.entity';
import { WebSocketService } from 'src/customer-modules/channel/chat-socket';

@Injectable()
export class WhatsAppWebhookService {
  private waAccountRepository: Repository<WhatsAppAccount>
  private waTemplateRepository: Repository<WhatsAppTemplate>
  private waMessageRepository: Repository<WhatsAppMessage>
  private channelRepository: Repository<Channel>
  private messageReactionRepository: Repository<MessageReaction>
  private channelMessageRepository: Repository<Message>


  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsService: ContactsService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly fileUploadService: FileUploadService,
    private readonly attachmentService: AttachmentService,
    private readonly waAccountService: WaAccountService,
    private readonly channelService: ChannelService,
    private readonly webSocketService: WebSocketService,
  ) {
    this.waAccountRepository = connection.getRepository(WhatsAppAccount);
    this.waTemplateRepository = connection.getRepository(WhatsAppTemplate);
    this.waMessageRepository = connection.getRepository(WhatsAppMessage);
    this.channelRepository = connection.getRepository(Channel);
    this.messageReactionRepository = connection.getRepository(MessageReaction);
    this.channelMessageRepository = connection.getRepository(Message)
  }

  checkSignature(req, businessAccount){
    // """Whatsapp will sign all requests it makes to our endpoint."""
    const signature = req.headers["x-hub-signature-256"] as string;

    if (!signature || signature.indexOf("sha256=") !== 0 || signature.length != 71){
      // # Signature must be valid SHA-256 (sha256=<64 hex digits>)
      console.log(`Invalid signature header ${signature}`)
      return false
    }
    if (!businessAccount.waWebhookToken){
      console.log('App-secret is missing, can not check signature')
      return false
    }

    const expectedHash =
    "sha256=" +
    crypto
      .createHmac("sha256", businessAccount.waWebhookToken)
      .update(JSON.stringify(req.body))
      .digest("hex");

    return signature !== expectedHash;
  }

  private isStateForward(
    current: messageStates,
    next: messageStates
  ): boolean {
    if (
      current === messageStates.error ||
      current === messageStates.bounced ||
      current === messageStates.cancel
    ) {
      return false;
    }
    const order = [
      messageStates.outgoing,
      messageStates.sent,
      messageStates.delivered,
      messageStates.read,
    ];

    return order.indexOf(next) >= order.indexOf(current);
  }


  async processMessages(req, waAccount, value){
    if (!value.messages && value.whatsapp_business_api_data?.messages !== undefined){
      value = value['whatsapp_business_api_data']
    }
    const workspaceId = req.params.workspace;
    const waApi = await this.waAccountService.getWhatsAppApi(waAccount.id)
    if (!value?.messages){
      return
    }
    for(const messages of value?.messages) {
      let parentMsgId;
      let parentId;
      let channel;
      let sender_name = value.contacts[0]?.profile?.name
      let sender_mobile = messages.from
      let message_type = messages.type

      if (messages.context && messages.context.id){
        let parentWhatsappMessage = await this.waMessageRepository.findOne({
          where: {msgUid: messages.context.id}
        })
        if (parentWhatsappMessage){
          parentMsgId = parentWhatsappMessage.id
          parentId = parentWhatsappMessage.channelMessageId
        }
        if (parentId){
          channel = this.channelRepository.findOne({
            where: {messages: {id: parentId.id}}
          })
        }
      }
      if (!channel){
        channel = await this.channelService.findActiveChannelOrCreate(sender_mobile, sender_name, true)
      }
      let kwargs = {
          'message_type': 'whatsapp_message',
          'parent_msg_id': parentMsgId,
          'parent_id': parentId ? parentId.id : null,
          'body': ''
      }

      if (message_type == 'text'){
        kwargs['body'] = messages['text']['body']
      }
      else if (message_type == 'button'){
        kwargs['body'] = messages['button']['text']
      }else if(['document', 'image', 'audio', 'video', 'sticker'].includes(message_type)){
        let filename = messages[message_type].filename
        const isVoice = messages[message_type].voice
        const mimeType = messages[message_type].mime_type
        const caption = messages[message_type].caption
        const fileResponse = await waApi.getWhatsAppDocument(messages[message_type]['id'])
        let extension;
        if (!filename){
          extension = mime.extension(mimeType) || '';
          filename = `${uuidv4()}.${extension}`
        }

        const now = new Date()
        const file = await this.fileUploadService.uploadFile({
          file: fileResponse[1],
          filename: filename,
          fileFolder: FileFolder.Attachment,
          mimeType: mimeType,
          workspaceId: workspaceId
        })
        const attachement = await this.attachmentService.createOneAttachment({
          name: filename,
          originalname: filename,
          size: fileResponse[0].file_size,
          mimetype: mimeType,
          path: file.path,
          createdAt: now,
          updatedAt: now
        })

        kwargs['attachment'] = attachement.id
        if (caption){
            kwargs['body'] = caption
        }
      }else if(message_type == 'contacts'){
        let body;
        for (const contact of messages['contacts']){
          body += `<i class='fa fa-address-book'/> ${contact.name.formatted_name} <br/>`
          for (const phone of contact.get('phones')){
            body += `${phone.type}: ${phone.phone}<br/>`
          }
        }
        kwargs['body'] = body
      }else if (message_type == 'reaction'){
        const msgUid = messages['reaction'].message_id
        const whatsAppMessage = await this.waMessageRepository.findOne({
          where: {msgUid: msgUid}
        })
        if(whatsAppMessage){
          const emoji = messages['reaction'].emoji
          const reaction = await this.messageReactionRepository.create({
            content: emoji,
            channelMessage: whatsAppMessage.channelMessageId,
            contactName: "Hello",
          })
          await this.messageReactionRepository.save(reaction)
          continue
        }
      }else{
        console.log("Unsupported whatsapp message type: %s", messages)
        continue
      }

      const sender = channel.channelMembers?.filter((conatct) => conatct.phoneNo == sender_mobile)
      const message = await this.channelService.createMessage(
        workspaceId,
        kwargs.body,
        channel.id,
        message_type,
        waAccount.id,
        true,
        kwargs['attachment'],
        messages['id'],
        sender ? sender[0] : undefined,
      );
    }

  }

  async processStatuses(req, waAccount, statuses: any[]) {
    const workspaceId = req.params.workspace;

    const WA_MESSAGE_STATE: Record<string, messageStates> = {
      sent: messageStates.sent,
      delivered: messageStates.delivered,
      read: messageStates.read,
      failed: messageStates.error,
    };

    const CHANNEL_MESSAGE_STATE: Partial<Record<messageStates, ChannelMessageState>> = {
      [messageStates.sent]: ChannelMessageState.sent,
      [messageStates.delivered]: ChannelMessageState.delivered,
      [messageStates.read]: ChannelMessageState.read,
      [messageStates.error]: ChannelMessageState.failed,
    };

    const CHANNEL_STATE_TO_FRONTEND: Partial<Record<ChannelMessageState, keyof typeof ChannelMessageState>> = {
      [ChannelMessageState.outgoing]: 'outgoing',
      [ChannelMessageState.sent]: 'sent',
      [ChannelMessageState.delivered]: 'delivered',
      [ChannelMessageState.read]: 'read',
      [ChannelMessageState.failed]: 'failed',
    };

    for (const status of statuses) {
      const waMsgUid = status.id;
      const waStatus = status.status;

      const newState = WA_MESSAGE_STATE[waStatus];
      if (!newState) continue;

      const waMessage = await this.waMessageRepository.findOne({
        where: { msgUid: waMsgUid },
        relations: [
          'channelMessageId',
          'channelMessageId.channel',
          'channelMessageId.channel.channelMembers',
        ],
      });

      if (!waMessage) continue;

      if (!this.isStateForward(waMessage.state, newState)) {
        continue;
      }

      await this.waMessageRepository.update(
        { id: waMessage.id },
        { state: newState }
      );

      const channelMessage = waMessage.channelMessageId;
      if (!channelMessage) continue;

      const channel = channelMessage.channel;
      if (!channel) continue;

      const isGroup = channel.channelMembers?.length > 1;

      const channelState = CHANNEL_MESSAGE_STATE[newState];
      if (!channelState) continue;

      if (!isGroup) {
        await this.channelService.updateMessageState(
          channelMessage.id,
          channelState
        );

        const frontendState = CHANNEL_STATE_TO_FRONTEND[channelState] || 'sent';
        if (!frontendState) continue;

        const payloadOfSocket={
          channelId: channel.id,
          messageId: channelMessage.id,
          state: frontendState,
        }

        this.webSocketService.messageStateUpdate(payloadOfSocket)
      } else {
        // group logic should be here
      }
    }
  }

}