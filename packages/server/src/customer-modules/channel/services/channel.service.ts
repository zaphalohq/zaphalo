import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Connection, Repository, In } from 'typeorm';
import { unlinkSync } from "fs";
import fs from 'fs';
import axios from "axios";

import { Channel } from "src/customer-modules/channel/entities/channel.entity";
import { Message } from "src/customer-modules/channel/entities/message.entity";
import { Contacts } from "src/customer-modules/contacts/contacts.entity";
import { ContactsService } from "src/customer-modules/contacts/contacts.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WaAccountService } from "src/customer-modules/whatsapp/services/whatsapp-account.service";
import { AttachmentService } from "src/customer-modules/attachment/attachment.service";
import { messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { WaMessageService } from "src/customer-modules/whatsapp/services/whatsapp-message.service";
import { WebSocketService } from 'src/customer-modules/channel/chat-socket';
import { FileService } from "src/modules/file-storage/services/file.service";


@Injectable()
export class ChannelService {
  private channelRepository: Repository<Channel>
  private messageRepository: Repository<Message>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsservice: ContactsService,
    private readonly waAccountService: WaAccountService,
    private readonly waMessageService: WaMessageService,
    private readonly attachmentService: AttachmentService,
    private readonly webSocketService: WebSocketService,
    private fileService: FileService
  ) {
    this.channelRepository = connection.getRepository(Channel);
    this.messageRepository = connection.getRepository(Message);
  }


  async findOrCreateChannel(phoneNo: any, memberIds: number[], channelName?: string) {
    const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds)
    const isChannelExist = await this.findExistingChannelByPhoneNo(memberIds)

    if (isChannelExist && isChannelExist.channelName)
      return { channel: isChannelExist, newChannelCreated: false }

    const newChannel = this.channelRepository.create({
      channelName: channelName || phoneNo,
      channelMembers: contacts,
    })
    await this.channelRepository.save(newChannel)

    return { channel: newChannel, newChannelCreated: true }
  }

  async findExistingChannelByPhoneNo(memberIds: any): Promise<Channel | undefined> {
    const channelExist = await this.channelRepository.find({
      where: { channelMembers: memberIds.map((member) => ({ phoneNo: member })) },
      relations: ['channelMembers']
    })

    const membersIdsStr = memberIds.sort((a, b) => a - b).join(',')
    const stillChannelExist = channelExist.find(channel => {
      const channelPhoneNoStr = channel.channelMembers
      .map(channelMembers => channelMembers.phoneNo)
      .sort((a, b) => a - b)
      .join(',')

      return channelPhoneNoStr == membersIdsStr;
    })

    return stillChannelExist
  }

  async createMessage(
    workspaceId: string,
    textMessage: string,
    channelId: string,
    messageType: string,
    unseen?: boolean,
    attachemntId?: string,
    waMessageId?: string,
    sender?: Contacts): Promise<Message[]> {
    let attachment;
    if (attachemntId) {
      attachment = await this.attachmentService.findOneAttachmentById(attachemntId);
    }

    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
      relations: ['channelMembers']
    });

    if (!channel) throw new Error('Channel not found');

    const messagesRepo: Message[] = []
        // for (const waMessageId of waMessageIds) {
    const chennelMessage = await this.messageRepository.create({
      textMessage,
      sender: sender,
      channel: channel,
      unseen: unseen,
      messageType,
      attachmentUrl: attachment ? attachment.name : null,
      attachment: attachment ? attachment : null
    })
    const message = await this.messageRepository.save(chennelMessage)
    messagesRepo.push(chennelMessage)

    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const receivers = channel?.channelMembers

    let attachmentUrl;
    if (message.attachmentUrl) {
      try {
        const workspaceLogoToken = this.fileService.encodeFileToken({
          workspaceId: workspaceId,
        });

        attachmentUrl = `${message.attachmentUrl}?token=${workspaceLogoToken}`;

      } catch (e) {
        attachmentUrl = message.attachmentUrl;
      }
    }

    const messageBody = {
      textMessage,
      messageType,
      attachmentUrl: attachmentUrl,
      attachmentName: attachment ? attachment.originalname : null,
    }
    if (sender){
      this.webSocketService.sendMessageToChannel(channel, sender?.phoneNo, messageBody, false);
    }

    for (const receiver of receivers) {
      const whatsappMessageVal = {
          body: textMessage,
          channelMessageId: chennelMessage,
          messageType: messageTypes.OUTBOUND,
          mobileNumber: receiver.phoneNo.toString(),
          waAccountId: findTrueInstants,
          freeTextJson: JSON.stringify("{}"),
          msgUid: waMessageId,
      }
      const waMessage = await this.waMessageService.createWaMessage(workspaceId, whatsappMessageVal)
    }

    return messagesRepo
  }

  async findAllChannel(): Promise<Channel[]> {
    const allChannel = await this.channelRepository.find({
      relations: ['channelMembers', 'messages'],
    })


    return await this.channelRepository
    .createQueryBuilder('channel')
    .leftJoinAndSelect('channel.channelMembers', 'channelMembers')
    .leftJoinAndSelect('channel.messages', 'messages', 'messages.unseen = :unseen', { unseen: false })
    .addSelect(
      (subQuery) =>
      subQuery
      .select('MAX(m.createdAt)', 'latest_time')
      .from(Message, 'm')
      .where('m.channelId = channel.id'),
      'latest_message_time'
      )
    .orderBy('latest_message_time', 'DESC', 'NULLS LAST')
    .getMany();
  }

  async findMsgByChannelId(channelId: any): Promise<Message[]> {

    var messages = await this.messageRepository.find({
      where: { channel: { id: channelId } },
      relations: ['channel', 'sender', 'attachment'],
      order: { createdAt: 'ASC' },
      skip: 0,
      take: 100
    })
    return messages;
  }

  async makeUnseenSeen(messages?: Message[], messageId?: string): Promise<void> {
    if (messages) {
      const messageIds = messages.map(message => message.id);

      await this.messageRepository.update(
        { id: In(messageIds) },
        { unseen: true },
        );
    } else {
      await this.messageRepository.update(
        { id: messageId },
        { unseen: true },
        );
    }

  }

  async findAllUnseen(): Promise<Message[]> {
    return await this.messageRepository.find({
      where: { unseen: false },
      relations: ['channel', 'sender'],
    })
  }

  async deleteChannelById(channelId: string) {
    const deleteChannel = await this.channelRepository.findOne({ where: { id: channelId } })
    if (deleteChannel)
      return this.channelRepository.remove(deleteChannel)
    else
      null
  }


  async updateChannelNameById(channelId: string, updatedValue: string) {
    const channel = await this.channelRepository.findOne({ where: { id: channelId } })
    if (!channel) {
      throw new Error('Channel not found');
    }
    channel.channelName = updatedValue
    return await this.channelRepository.save(channel)
  }



  async handleFileUpload(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new Error('No file provided');
    }
    const baseUrl = 'http://localhost:3000';
    const fileUrl = `${baseUrl}/${file.filename}`;
    return fileUrl;
  }



  async deleteFile(filename: string): Promise<void> {
    try {
      unlinkSync(`uploads\\${filename}`);
    } catch (error) {
      throw new Error("Failed to delete file: ${error.message}");
    }
  }

  async findMessageType(attachmentUrl: string) {
    try {
      const lastDotIndex = attachmentUrl.lastIndexOf('.');
      if (lastDotIndex === -1) return 'Invalid URL';

      const urlExt = attachmentUrl?.slice(lastDotIndex + 1).toLowerCase();

      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(urlExt)) return 'image';
      if (['mp4', 'mov', '3gp'].includes(urlExt)) return 'video';
      if (['mp3', 'ogg', 'wav', 'aac'].includes(urlExt)) return 'audio';
      if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(urlExt)) return 'document';

      return 'Invalid URL';
    } catch (err) {
      console.error('Invalid URL:', attachmentUrl);
      return 'Invalid URL';
    }
  }


  async getMediaUrl(mediaId: string, writePath: string) {
    const wa_api = await this.waAccountService.getWhatsAppApi();
    const mediaData = await wa_api.getMediaUrl(mediaId);
    const response = await axios.get(mediaData.url, {
      headers: {
        Authorization: `Bearer ${wa_api?.token}`,
      },
      responseType: 'arraybuffer',
    });
    await fs.writeFileSync(writePath, response.data);
    return mediaData
  }

  async findActiveChannelOrCreate(senderMobile, senderName, createIfNotFound){
    const contact = await this.contactsservice.findActiveContactOrCreate(senderMobile, senderName)

    const channelExist = await this.channelRepository.findOne({
      where: { channelMembers: { phoneNo: senderMobile} },
      relations: ['channelMembers']
    })
    if (!channelExist){
      const newChannel = this.channelRepository.create({
        channelName: senderName || senderMobile,
        channelMembers: [contact],
      })
      await this.channelRepository.save(newChannel)
      return newChannel
    }
    return channelExist
  }



}