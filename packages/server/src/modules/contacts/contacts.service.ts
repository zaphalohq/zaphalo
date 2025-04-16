import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Contacts } from "./contacts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createContactsDto } from "./dto/createContactsDto";
import { log } from "console";

@Injectable()
export class contactsService {
    constructor(
        @InjectRepository(Contacts, 'core')
        private contactsRepository: Repository<Contacts>

    ) { }

    async findOneContact(senderId: number) {
        return await this.contactsRepository.findOne({ where: { phoneNo: senderId } },)
    }

    async createContacts(CreateContacts: createContactsDto) {
        const existContact = await this.findOneContact(CreateContacts.phoneNo)
        if (existContact) 
            return existContact
        
        const createdContacts = this.contactsRepository.create({
            contactName : CreateContacts.contactName,
            phoneNo : CreateContacts.phoneNo,
            profileImg : CreateContacts.profileImg,
        });        
        await this.contactsRepository.save(createdContacts);
        return createdContacts;
    }


    async findAllContacts(): Promise<Contacts[]> {
        return await this.contactsRepository.find({
            order: { createdAt: 'ASC' }, // Sort by creation time
        });
    }

    async findContactsByPhoneNoArr(memberIds: any) {
        return await this.contactsRepository.find({
            where: memberIds.map(element => ({ phoneNo: element })),
            // relations : ['channel']
        },
        )

    }




}