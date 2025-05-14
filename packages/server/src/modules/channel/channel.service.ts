import { Injectable } from "@nestjs/common";
import { ArrayContains, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Channel } from "./channel.entity";
import { Message } from "./message.entity";
import { Contacts } from "../contacts/contacts.entity";
import { contactsService } from "../contacts/contacts.service";
import { log } from "console";
import { arrayContains } from "class-validator";

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel, 'core')
        private channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private messageRepository: Repository<Message>,
        private readonly contactsservice: contactsService,
    ) { }


    async findOrCreateChannel( memberIds : number[], writeUser :any, channelName?: string) {
        // const memberIdsSort = [...somememberIds].sort((a , b) => a -b)
        // const channelExist = await this.channelRepository
        // .createQueryBuilder("channel")
        // .where("channel.memberIds = :memberIds", { 
        //   memberIds: JSON.stringify(memberIdsSort) 
        // })
        // .getOne();
      
        // console.log(".............", channelExist);
        // if(channelExist){
        //     return channelExist
        // }
        // console.log([...somememberIds]);
        
        const contacts = await this.contactsservice.findContactsByPhoneNoArr(memberIds)
        console.log(contacts);
        
        const newChannel = this.channelRepository.create({
            channelName : channelName || `channel_${Date.now()}`, // Default name if none
            contacts :  contacts,
            writeUser,
            createUser : writeUser
        })
        await this.channelRepository.save(newChannel)
        // console.log(newChannel);
        
        return newChannel
    }

    async createMessage( message:string , channelId : string, senderIdA : number, attachment: string = '') {
        const sender = await this.contactsservice.findOneContact(senderIdA);
        if (!sender) throw new Error('Sender not found');
        const channel = await this.channelRepository.findOne({ where : { id : channelId}});
        if (!channel) throw new Error('Channel not found');
        
        const message_rec = this.messageRepository.create({
            message,
            attachment,
            sender : sender,
            channel : channel,
        })
        await this.messageRepository.save(message_rec)
        // console.log(message_rec);
        
        return message
    }

    async findAllChannel() : Promise<Channel[]>{
        return await this.channelRepository.find({ relations : ['contacts']});
    }

    async findMsgByChannelId(channelId : any): Promise<Message[]> {
        
        var a = await this.messageRepository.find({
            where : { channel : { id : channelId }},
            relations: ['channel', 'sender'],
        })
        return a;
    }
}