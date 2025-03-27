import { Injectable, Logger } from "@nestjs/common";
import { ArrayContains, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { Contacts } from "../contacts/contacts.entity";
import { contactsService } from "../contacts/contacts.service";
import { log } from "console";
import { arrayContains } from "class-validator";
import { UserService } from "../user/user.service";

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel, 'core')
        private channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private messageRepository: Repository<Message>,
        private readonly contactsservice: contactsService,
        private readonly userService: UserService
    ) { }


    async findOrCreateChannel(phoneNo: any, memberIds: number[], userId?: any, channelName?: string) {
        const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds)

        //----finding channel exist or not ------------------------
        const isChannelExist = await this.findExistingChannelByPhoneNo(memberIds)
        if (isChannelExist && isChannelExist.channelName)
            return isChannelExist
        const user = await this.userService.findByUserId(userId? userId : 'cf8e3529-674a-49d5-95da-8e81a816adbb')
        if (!user) throw new Error("user doesnt found")
        const newChannel = this.channelRepository.create({
            channelName: channelName || phoneNo, // Default name as phoneNo
            contacts: contacts,
            writeUser: user,
            createUser: user,
            membersidsss: JSON.stringify(memberIds),
        })
        await this.channelRepository.save(newChannel)
        console.log('thi siis memebrs ids', memberIds);
        
        return newChannel
    }

    async findExistingChannelByPhoneNo(memberIds : any): Promise<Channel | undefined> {
        const channelExist = await this.channelRepository.find({
            where: { contacts: memberIds.map((member) => ({ phoneNo: member })) },
            relations: ['contacts']
        })
        console.log(channelExist, "this is the one channelExistst ");
        const membersIdsStr = memberIds.sort((a, b) => a - b).join(',')
        const stillChannelExist = channelExist.find(channel => {
            const channelPhoneNoStr = channel.contacts
                .map(contacts => contacts.phoneNo)
                .sort((a, b) => a - b)
                .join(',')
            return channelPhoneNoStr == membersIdsStr;
        })
        console.log(stillChannelExist, "existing stillChannelExist");

        return stillChannelExist
    }

    async createMessage(message: string, channelId: string, senderIdA: number, attachment: string = '') {
        const sender = await this.contactsservice.findOneContact(senderIdA);
        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where: { id: channelId } });
        if (!channel) throw new Error('Channel not found');

        const message_rec = this.messageRepository.create({
            message,
            attachment,
            sender: sender,
            channel: channel,
        })
        await this.messageRepository.save(message_rec)
        // console.log(message_rec);

        return message
    }

    async findAllChannel(): Promise<Channel[]> {
        return await this.channelRepository.find({ relations: ['contacts'] });
    }

    async findMsgByChannelId(channelId: any): Promise<Message[]> {

        var a = await this.messageRepository.find({
            where: { channel: { id: channelId } },
            relations: ['channel', 'sender'],
            order: { createdAt: 'ASC' }
        })
        return a;
    }
}