import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { ContactsService } from "../contacts/contacts.service";
import { UserService } from "../user/user.service";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import axios, { AxiosResponse } from "axios"
import fs from "fs"
import { WorkspaceService } from "../workspace/workspace.service";


@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel, 'core')
        private channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private messageRepository: Repository<Message>,
        private readonly contactsservice: ContactsService,
        private readonly userService: UserService,
        private readonly workspaceService: WorkspaceService,
        // Use an absolute path relative to the module's location
        // private readonly uploadDir = './uploads'
    ) { }


    async findOrCreateChannel(phoneNo: any, memberIds: number[], workspaceId: string, channelName?: string, userId?: any,) {
        const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds, workspaceId)

        //----finding channel exist or not ------------------------
        const isChannelExist = await this.findExistingChannelByPhoneNo(memberIds, workspaceId)
        console.log(isChannelExist, "isChannelExist...................isChannelExist");

        if (isChannelExist && isChannelExist.channelName)
            return { channel: isChannelExist, newChannelCreated: false }
        const user = await this.userService.findByUserId(userId)
        if (!user) throw new Error("user doesnt found")
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")
        const newChannel = this.channelRepository.create({
            channelName: channelName || phoneNo, // Default name as phoneNo
            contacts: contacts,
            writeUser: user,
            createUser: user,
            membersidsss: JSON.stringify(memberIds),
            workspace: workspace,
        })
        await this.channelRepository.save(newChannel)
        // console.log('thi siis memebrs ids', memberIds);
        console.log(newChannel, "..................................ds.ds.......................");

        return { channel: newChannel, newChannelCreated: true }
    }

    async findExistingChannelByPhoneNo(memberIds: any, workspaceId: string): Promise<Channel | undefined> {
        const channelExist = await this.channelRepository.find({
            where: { contacts: memberIds.map((member) => ({ phoneNo: member })), workspace: { id: workspaceId } },
            relations: ['contacts', 'workspace']
        })
        console.log(channelExist, memberIds, "this is the one channelExistst ");
        //------------this is for messaging to own number------------
        // if(memberIds.length === 2 && memberIds[0] === memberIds[1]){
        //     const defaultChannel = await this.channelRepository.findOne({
        //         where : { channelName : 'default No'}
        //     })
        //     return defaultChannel || undefined
        // } else { }
        // console.log(channelExist,"..............channelExist......................");

        const membersIdsStr = memberIds.sort((a, b) => a - b).join(',')
        const stillChannelExist = channelExist.find(channel => {
            const channelPhoneNoStr = channel.contacts
                .map(contacts => contacts.phoneNo)
                .sort((a, b) => a - b)
                .join(',')
            // console.log(channelPhoneNoStr);

            return channelPhoneNoStr == membersIdsStr;
        })
        console.log(stillChannelExist, "existing stillChannelExist.....................................................................................");

        return stillChannelExist
    }

    async createMessage(textMessage: string, channelId: string, senderId: number, workspaceId: string | undefined, unseen?: boolean, attachmentUrl?: string) {
        const sender = await this.contactsservice.findOneContact(senderId, workspaceId);
        console.log(sender, channelId, "sendersendersendersendersendersendersendersender");

        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where: { id: channelId, workspace: { id: workspaceId } } });
        if (!channel) throw new Error('Channel not found');
        console.log(channel, "channelchannelchannelchannelchannelchannelchannel");

        const message_rec = this.messageRepository.create({
            textMessage,
            attachmentUrl,
            sender: sender,
            channel: channel,
            unseen: unseen,
        })
        await this.messageRepository.save(message_rec)
        // console.log(message_rec);

        return message_rec
    }

    async findAllChannel(workspaceId: string): Promise<Channel[]> {
        const allChannel = await this.channelRepository.find({
            relations: ['contacts'],
        })


        return await this.channelRepository
            .createQueryBuilder('channel')
            .leftJoinAndSelect('channel.contacts', 'contacts')
            .leftJoinAndSelect('channel.messages', 'messages', 'messages.unseen = :unseen', { unseen: false })
            .leftJoinAndSelect('channel.workspace', 'workspace') // Ensure workspace relation is loaded
            .where('workspace.id = :workspaceId', { workspaceId }) // Filter by workspaceId
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

        // return await this.channelRepository
        // .createQueryBuilder('channel')
        // .leftJoinAndSelect('channel.contacts', 'contacts')
        // .leftJoinAndSelect('channel.messages',
        //                    'messages',
        //                    "messages.unseen = :unseen", // Filter messages where unseen is false
        //                     { unseen: false }
        //                 )
        // .addSelect(
        //   (subQuery) =>
        //     subQuery
        //       .select('MAX(m.createdAt)', 'latest_time')
        //       .from(Message, 'm')
        //       .where('m.channelId = channel.id'),
        //   'latest_message_time'
        // )
        // .orderBy('latest_message_time', 'DESC', 'NULLS LAST')
        // .getMany();
    }

    // async findAllChannel(): Promise<Channel[]> {
    //     return await this.channelRepository
    //       .createQueryBuilder('channel')
    //       .leftJoinAndSelect('channel.contacts', 'contacts')
    //       .leftJoinAndSelect('channel.messages', 'messages') // Join messages
    //       .groupBy('channel.id') // Group by channel to avoid duplicates
    //       .orderBy('MAX(messages.createdAt)', 'DESC', 'NULLS LAST') // Sort by latest message
    //       .getMany();
    //   }

    //   async findMsgByChannelId(channelId: string): Promise<Message[]> {

    //     return await this.messageRepository
    //       .createQueryBuilder('message')
    //       .leftJoinAndSelect('message.channel', 'channel')
    //       .leftJoinAndSelect('message.sender', 'sender')
    //       .where('channel.id = :channelId', { channelId })
    //       .orderBy('message.createdAt', 'ASC')
    //       .getMany();
    //   }

    async findMsgByChannelId(channelId: any): Promise<Message[]> {

        var messages = await this.messageRepository.find({
            where: { channel: { id: channelId } },
            relations: ['channel', 'sender'],
            order: { createdAt: 'ASC' }
        })
        return messages;
    }

    async makeUnseenSeen(messages: Message[]): Promise<void> {
        const messageIds = messages.map(message => message.id); // Extract IDs

        // Update all matching messages in one query
        await this.messageRepository.update(
            { id: In(messageIds) }, // Where clause with IDs
            { unseen: true },       // Fields to update
        );
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

        // Generate the URL
        const baseUrl = 'http://localhost:3000';
        const fileUrl = `${baseUrl}/${file.filename}`;

        // Here you could add additional logic, like saving file metadata to a database
        console.log(`File saved: ${file.path}, URL: ${fileUrl}`);
        // // Convert to Base64 (for logging or other purposes)
        // const fileBuffer = fs.readFileSync(file.path);
        // const base64String = fileBuffer.toString('base64');
        // console.log(base64String);

        //              const response = await axios({
        //             url: 'https://graph.facebook.com/v22.0/565830889949112/messages',
        //             method: 'POST',
        //             headers: {
        //                 'Authorization': `Bearer ${process.env.Whatsapp_Token}`,
        //                 'Content-Type': 'application/json'
        //             },
        //             data: JSON.stringify({
        //                 "messaging_product": "whatsapp",
        //                 "to": "917202031718",
        //                 "type": "image",
        //                 "image": {
        //                     "link" : base64String,
        //                     "caption" : "this is image"
        //                 }
        //             })
        //         })

        return fileUrl;
    }



    async deleteFile(filename: string): Promise<void> {
        // const filePath = join(this.uploadDir, filename);

        // if (!existsSync(filePath)) {
        //     throw new NotFoundException(`File ${filename} not found`);
        // }

        try {
            unlinkSync(`uploads\\${filename}`);
            console.log('File deleted: ${filePath}');
        } catch (error) {
            throw new Error("Failed to delete file: ${error.message}");
        }
    }

    async findMessageType(attachmentUrl: string) {
        try {
            const lastDotIndex = attachmentUrl.lastIndexOf('.');
            if (lastDotIndex === -1) return 'Invalid URL';

            const urlExt = attachmentUrl.slice(lastDotIndex + 1).toLowerCase();

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
        const url = `https://graph.facebook.com/v22.0/${senderId}/messages`;

        let messagePayload = {};

        if (messageType === 'Invalid URL' && textMessage) {
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

        const finalPayload = {
            messaging_product: 'whatsapp',
            to: receiverId,
            ...messagePayload,
        };
        console.log('access EAAao8Mkc6lMBOZBEsL7ZCkENxPbZAP1Ocs3z8phccZAa0ctc2lzLXumH34AjS8pkAkTvp7hDxTSG0TnutK4JfwXal9GINecTl3i2J4ezaFSq1qZCVXH7JToLL3crmRSZBZBZBDNvaZAg377BTpLuDKGv85kERpa5kFobcpp6lk39aohrLqYyTjJTzdSMG9PbLEnU9Q7sbGrOZALXAMzZCqCUHHaNPrnBFc3xlr0ZB6a3');
        console.log(accessToken);
        
        
        const response = await axios.post(url, finalPayload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }


}