import { Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { WebSocketService } from './chat-socket';
import { ContactsService } from 'src/customer-modules/contacts/contacts.service';
import { WaWebhookGuard } from './guards/wa_webhook_guard';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { Request as ExpressRequest } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extension } from 'mime-types';
import { AttachmentService } from '../attachment/attachment.service';
import { FileService } from 'src/modules/file-storage/services/file.service';

@Controller('whatsapp')
export class channelController {
  constructor(
    private readonly webSocketService: WebSocketService,
    private readonly channelService: ChannelService,
    private readonly contactsservice: ContactsService,
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly attachmentService: AttachmentService,
    private fileService: FileService

  ) { }

  @Get('/:workspace/webhook')
  @UseGuards(WaWebhookGuard)
  async getWhatsappApi(@Query() query: any) {
    const challenge = query['hub.challenge']
    const verify_token = query['hub.verify_token']
    const verified = this.jwtWrapperService.verifyWorkspaceToken(verify_token, 'API_KEY')

    if (verified) {
      return challenge
    }
  }

  @Post('/:workspace/webhook')
  async postWhatsappApi(@Request() req: ExpressRequest): Promise<any> {
    const workspaceId = req.params.workspace;
    const data = JSON.parse(JSON.stringify(req.body, null, 2))
    const changes = data?.entry?.[0]?.changes?.[0]?.value;
    if (!changes?.messages) return;

    const messageData = changes.messages[0];
    const messageType = messageData.type;
    const userPhoneNo = messageData.from;
    const myAccountPhoneNo = Number(changes.metadata.phone_number_id);

    const createContactNotExist = await this.contactsservice.createContacts({
      contactName: userPhoneNo,
      phoneNo: Number(userPhoneNo)
    });

    if (!createContactNotExist) throw new Error('ContactNotExist not found');

    const { channel, newChannelCreated }: any = await this.channelService.findOrCreateChannel(
      userPhoneNo,
      [myAccountPhoneNo, Number(userPhoneNo)]
    );

    if (!channel.id) throw new Error('Channel not found');

    const waMessageIds = [messageData.id]

    if (messageType === 'text') {
      const textMessage = messageData.text.body;
      const message = await this.channelService.createMessage(
        textMessage,
        channel.id,
        Number(userPhoneNo),
        messageType,
        // waMessageIds
      );
      this.webSocketService.sendMessageToChannel(channel.id, message[0], Number(userPhoneNo), newChannelCreated);
      return message;
    } else if (
      messageType === 'image' ||
      messageType === 'video' ||
      messageType === 'audio' ||
      messageType === 'document'
    ) {
      const mediaId = messageData[messageType]?.id;
      const mediaMimeType = messageData[messageType]?.mime_type;
      const originalname = messageData[messageType]?.filename;

      const filename = `${uuidv4()}.${extension(mediaMimeType)}`
      const writePath = `.local-storage\\files-storage\\workspace-${workspaceId}\\${filename}`
      const mediaData = await this.channelService.getMediaUrl(mediaId, writePath);
      const now = new Date()
      const attachement = await this.attachmentService.createOneAttachment({
        name: filename,
        originalname: originalname ? originalname : filename,
        size: mediaData.file_size,
        mimetype: mediaMimeType,
        path: writePath,
        createdAt: now,
        updatedAt: now
      })
      const textMessage = ''
      const message = await this.channelService.createMessage(
        textMessage,
        channel.id,
        Number(userPhoneNo),
        messageType,
        true,
        attachement.id,
        // waMessageIds,
      );
      const workspaceLogoToken = this.fileService.encodeFileToken({
        workspaceId: workspaceId,
      });
      message[0].attachmentUrl = `${message[0].attachmentUrl}?token=${workspaceLogoToken}`
      this.webSocketService.sendMessageToChannel(channel.id, message[0], Number(userPhoneNo), newChannelCreated);
    } else {
      throw new Error(`Received an unsupported message type: ${messageType}`)
    }


  }
}