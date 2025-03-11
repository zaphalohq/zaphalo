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

    async createMessage( msg: string, channelId : string, senderIdA : String, attachment: string = null) {
        const  senderId = await this.contactsservice.findOneContact((senderIdA))
        

        const channel = await this.channelRepository.findOne({ where : { id : channelId}})
        const message = this.messageRepository.create({
            msg,
            attachment,
            senderId,
            channel

        })
        await this.messageRepository.save(message)
        console.log(message);
        
        return message
    }
}