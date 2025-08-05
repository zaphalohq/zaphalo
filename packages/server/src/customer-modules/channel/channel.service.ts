import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { ContactsService } from "../contacts/contacts.service";
import { unlinkSync } from "fs";
import axios from "axios"
import { Connection, Repository, In } from 'typeorm';
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';

@Injectable()
export class ChannelService {
    private channelRepository: Repository<Channel>
    private messageRepository: Repository<Message>
    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly contactsservice: ContactsService,

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

    async createMessage(textMessage: string, channelId: string, senderId: number, unseen?: boolean, attachmentUrl?: string) {
        const sender = await this.contactsservice.findOneContact(senderId);

        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) throw new Error('Channel not found');

        const message_rec = this.messageRepository.create({
            textMessage,
            attachmentUrl,
            sender: sender,
            channel: channel,
            unseen: unseen,
        })
        await this.messageRepository.save(message_rec)

        return message_rec
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
            relations: ['channel', 'sender'],
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
        accessToken,
        senderId,
        receiverId,
        messageType,
        textMessage,
        attachmentUrl
    }) {
        const url = `https://graph.facebook.com/v23.0/${senderId}/messages`;

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
                    link: "https://images.unsplash.com/photo-1575936123452-b67c3203c357?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
                    caption: textMessage || '',
                },
            };
        } else if (messageType === 'document') {

            messagePayload = {
                type: 'document',
                document: {
                    link: attachmentUrl,
                    filename: textMessage || 'file.pdf',
                },
            };
        } else if (messageType === 'video') {
            messagePayload = {
                type: 'video',
                video: {
                    link: attachmentUrl,
                    caption: textMessage || '',
                },
            };
        } else if (messageType === 'audio') {
            messagePayload = {
                type: 'audio',
                audio: {
                    link: attachmentUrl,
                },
            };
        } else {
            throw new Error(`Unsupported message type: ${messageType}`);
        }

        receiverId.forEach(async (receiver) => {

            const finalPayload = {
                messaging_product: 'whatsapp',
                to: receiverId[0],
                ...messagePayload,
            };


            const response = await axios.post(url, finalPayload, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data, 'message response');

            return response.data;
        });

    }

}