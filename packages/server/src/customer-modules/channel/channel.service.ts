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
            contacts: contacts,
            membersidsss: JSON.stringify(memberIds),
        })
        await this.channelRepository.save(newChannel)

        return { channel: newChannel, newChannelCreated: true }
    }

    async findExistingChannelByPhoneNo(memberIds: any): Promise<Channel | undefined> {
        const channelExist = await this.channelRepository.find({
            where: { contacts: memberIds.map((member) => ({ phoneNo: member })) },
            relations: ['contacts']
        })

        const membersIdsStr = memberIds.sort((a, b) => a - b).join(',')
        const stillChannelExist = channelExist.find(channel => {
            const channelPhoneNoStr = channel.contacts
                .map(contacts => contacts.phoneNo)
                .sort((a, b) => a - b)
                .join(',')

            return channelPhoneNoStr == membersIdsStr;
        })

        return stillChannelExist
    }

    async createMessage(
        textMessage: string,
        channelId: string,
        senderId: number,
        messageType: string,
        unseen?: boolean,
        attachemntId?: string,
        waMessageIds?: string[]): Promise<Message[]> {
        let attachment;
        if (attachemntId) {
            attachment = await this.attachmentService.findOneAttachmentById(attachemntId);
        }
        const sender = await this.contactsservice.findOneContact(senderId);

        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) throw new Error('Channel not found');

        const messagesRepo: Message[] = []
        // for (const waMessageId of waMessageIds) {
        const message_rec = this.messageRepository.create({
            textMessage,
            sender: sender,
            channel: channel,
            unseen: unseen,
            // waMessageId: waMessageId,
            messageType,
            attachmentUrl: attachment ? attachment.name : null,
            attachment: attachment ? attachment : null
        })
        await this.messageRepository.save(message_rec)
        messagesRepo.push(message_rec)
        // }
        return messagesRepo
    }

    async findAllChannel(): Promise<Channel[]> {
        const allChannel = await this.channelRepository.find({
            relations: ['contacts'],
        })


        return await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.contacts', 'contacts')
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

    async sendWhatsappMessage({
        channelMessage,
        receiverId,
        messageType,
        textMessage,
        attachmentUploadtoWaApiId
    }): Promise<string[]> {
        const messagePayload = await this.generateMessagePayload(
            messageType,
            textMessage,
            attachmentUploadtoWaApiId
        );

      const findTrueInstants = await this.waAccountService.FindSelectedInstants()
      if (!findTrueInstants)
        throw new Error("Not found whatsappaccount")


        const waMessageIds: string[] = [];

        for (const receiver of receiverId) {

            const finalPayload = {
                messaging_product: 'whatsapp',
                to: receiver,
                ...messagePayload,
            };

            const whatsappMessageVal = {
                body: textMessage,
                channelMessageId: channelMessage,
                messageType: messageTypes.OUTBOUND,
                mobileNumber: receiver,
                waAccountId: findTrueInstants,
                freeTextJson: JSON.stringify(finalPayload)
            }
            const waMessage = this.waMessageRepository.create(whatsappMessageVal)
            await this.waMessageRepository.save(waMessage)

            const wa_api = await this.waAccountService.getWhatsAppApi();
            const message_id = await wa_api.sendWhatsApp(JSON.stringify(finalPayload));
            if (!message_id) throw new Error('Message not sent to WhatsApp');

            waMessageIds.push(message_id);
        }

        return waMessageIds;
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

    async generateMessagePayload(messageType, textMessage, attachmentUploadtoWaApiId?) {
        let messagePayload = {};

        if (messageType === 'text' && textMessage) {
            messagePayload = {
                type: 'text',
                text: {
                    body: textMessage,
                },
            };
        } else if (messageType === 'image') {
            messagePayload = {
                type: 'image',
                image: {
                    id: attachmentUploadtoWaApiId,
                    caption: textMessage || '',
                },
            };
        } else if (messageType === 'document') {

            messagePayload = {
                type: 'document',
                document: {
                    id: attachmentUploadtoWaApiId,
                    filename: textMessage || 'file.pdf',
                },
            };
        } else if (messageType === 'video') {
            messagePayload = {
                type: 'video',
                video: {
                    id: attachmentUploadtoWaApiId,
                    caption: textMessage || '',
                },
            };
        } else if (messageType === 'audio') {
            messagePayload = {
                type: 'audio',
                audio: {
                    id: attachmentUploadtoWaApiId,
                },
            };
        } else {
            throw new Error(`Unsupported message type: ${messageType}`);
        }

        return messagePayload;
    }

}