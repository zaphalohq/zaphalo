import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { ContactsService } from "../contacts/contacts.service";
import { unlinkSync } from "fs";
import { Connection, Repository, In } from 'typeorm';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { WaAccountService } from "../whatsapp/services/whatsapp-account.service";
import { AttachmentService } from "../attachment/attachment.service";
import { WhatsAppMessage, messageTypes } from "src/customer-modules/whatsapp/entities/whatsapp-message.entity";
import { WaMessageService } from "src/customer-modules/whatsapp/services/whatsapp-message.service";


import fs from 'fs';
import axios from "axios";

@Injectable()
export class ChannelService {
  private channelRepository: Repository<Channel>
  private messageRepository: Repository<Message>
  private waMessageRepository: Repository<WhatsAppMessage>

  constructor(
    @Inject(CONNECTION) connection: Connection,
    private readonly contactsservice: ContactsService,
    private readonly waAccountService: WaAccountService,
    private readonly waMessageService: WaMessageService,
    private readonly attachmentService: AttachmentService,

    ) {
    this.channelRepository = connection.getRepository(Channel);
    this.messageRepository = connection.getRepository(Message);
    this.waMessageRepository = connection.getRepository(WhatsAppMessage);
  }


  async findOrCreateChannel(phoneNo: any, memberIds: number[], channelName?: string) {
    const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds)
    const isChannelExist = await this.findExistingChannelByPhoneNo(memberIds)

    if (isChannelExist && isChannelExist.channelName)
      return { channel: isChannelExist, newChannelCreated: false }

    const newChannel = this.channelRepository.create({
      channelName: channelName || phoneNo,
      channelMembers: contacts,
      // membersidsss: JSON.stringify(memberIds),
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
    waMessageIds?: string[]): Promise<Message[]> {
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
    const message_rec = this.messageRepository.create({
      textMessage,
      // sender: sender,
      channel: channel,
      unseen: unseen,
      messageType,
      attachmentUrl: attachment ? attachment.name : null,
      attachment: attachment ? attachment : null
    })
    const message = await this.messageRepository.save(message_rec)
    messagesRepo.push(message_rec)

    const findTrueInstants = await this.waAccountService.FindSelectedInstants()
    if (!findTrueInstants)
      throw new Error("Not found whatsappaccount")

    const receivers = channel?.channelMembers


    for (const receiver of receivers) {
      const whatsappMessageVal = {
          body: textMessage,
          channelMessageId: message,
          messageType: messageTypes.OUTBOUND,
          mobileNumber: receiver.phoneNo.toString(),
          waAccountId: findTrueInstants,
          freeTextJson: JSON.stringify("{}")
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



}