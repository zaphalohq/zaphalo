import { Inject, Injectable } from "@nestjs/common";
import { Contacts } from "./contacts.entity";
import { createContactsDto } from "./dto/createContactsDto";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';
import { updateContactsDto } from "./dto/updateContactsDto";
import { throwError } from "rxjs";

@Injectable()
export class ContactsService {
        private contactsRepository: Repository<Contacts>
    constructor(
         @Inject(CONNECTION) connection: Connection,
    ) { 
        this.contactsRepository = connection.getRepository(Contacts);
    }

    async findOneContact(senderId: number) {
        return await this.contactsRepository.findOne({ where: { phoneNo: senderId }})
    }

    async createContacts(CreateContacts: createContactsDto) {
        const existContact = await this.findOneContact(CreateContacts.phoneNo)
        if (existContact) 
            return existContact
        const createdContacts = this.contactsRepository.create({
            contactName : CreateContacts.contactName,
            phoneNo : CreateContacts.phoneNo,
            profileImg : CreateContacts.profileImg,
            defaultContact: CreateContacts.defaultContact || false
        });        
        await this.contactsRepository.save(createdContacts);
        return createdContacts
    }


    async findAllContacts(): Promise<Contacts[]> {

        return await this.contactsRepository.find({
            where: { defaultContact : false },
            order: { createdAt: 'ASC' },
        });
    }

    async findContactsByPhoneNoArr(memberIds: any) {
        return await this.contactsRepository.find({
            where: memberIds.map(phoneNo => ({ 
                phoneNo,
             })),
        },
        )

    }

    async UpdateContact(UpdateContact : updateContactsDto){
        const updateContact = await this.contactsRepository.findOne({ where: { id : UpdateContact.id}})
        if(!updateContact) throw Error("contact doesn't found." )
        updateContact.contactName = UpdateContact.contactName;
        updateContact.phoneNo = UpdateContact.phoneNo;
        updateContact.profileImg = UpdateContact.profileImg;
        return await this.contactsRepository.save(updateContact);
    }

    async DeleteContact(contactId : string){
        const deleteContact = await this.contactsRepository.findOne({ where : { id : contactId }});
        if (deleteContact)
            return  await this.contactsRepository.remove(deleteContact)
        else
            return null

    }


}