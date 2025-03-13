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
export class channelService {
    constructor(
        @InjectRepository(Channel, 'core')
        private channelRepository: Repository<Channel>,
        @InjectRepository(Message, 'core')
        private messageRepository: Repository<Message>,
        private readonly contactsservice: contactsService,
    ) { }


    async findOrCreateChannel( somememberIds : number[], writeUser :any, channelName?: string) {
        const memberIdsSort = [...somememberIds].sort((a , b) => a -b)
        const channelExist = await this.channelRepository
        .createQueryBuilder("channel")
        .where("channel.memberIds = :memberIds", { 
          memberIds: JSON.stringify(memberIdsSort) 
        })
        .getOne();
      
        console.log(".............", channelExist);
        if(channelExist){
            return channelExist
        }
        console.log([...somememberIds]);
        
        const newChannel = this.channelRepository.create({
            channelName : channelName || `channel_${Date.now()}`, // Default name if none
            memberIds :  memberIdsSort,
            writeUser,
            createUser : writeUser
        })
        await this.channelRepository.save(newChannel)
        console.log(newChannel);
        
        return newChannel
    }

    async createMessage( message: string, channelId : string, senderIdA : number, attachment: string = '') {
        const senderId = await this.contactsservice.findOneContact((senderIdA))[0];

        

        const channel_id = await this.channelRepository.findOne({ where : { id : channelId}})[0];
        const message_rec = this.messageRepository.create({
            message,
            attachment,
            senderId,
            channel_id
        })
        await this.messageRepository.save(message_rec)
        console.log(message_rec);
        
        return message
    }
}