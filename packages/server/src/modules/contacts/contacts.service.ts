import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Contacts } from "./contacts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createContactsDto } from "./dto/createContactsDto";

@Injectable()
export class contactsService{
    constructor(
        @InjectRepository(Contacts, 'core')
        private contactsRepository: Repository<Contacts>
        
    ) {}
    async createContacts(CreateContacts : createContactsDto) {
        const createdContacts = this.contactsRepository.create(CreateContacts);
        await this.contactsRepository.save(createdContacts);
        return createdContacts;
    }

    async findOneContact(senderId : String){
        return await this.contactsRepository.findOne({ where : { phoneNo : senderId}})
    }

        async findAllContacts(): Promise<Contacts[]> {
            return await this.contactsRepository.find({
                order: { createdAt: 'ASC' }, // Sort by creation time
              });
        }
}