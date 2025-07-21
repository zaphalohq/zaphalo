import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingContact, MailingListInputDto } from "./DTO/MailingListReqDto";
import { MailingContacts } from "./mailingContacts.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';


@Injectable()
export class MailingListService {
    private mailingListRepository: Repository<MailingList>
    private mailingContactsRepository: Repository<MailingContacts>
    constructor(
        @Inject(CONNECTION) connection: Connection,
    ) {
        this.mailingListRepository = connection.getRepository(MailingList);
        this.mailingContactsRepository = connection.getRepository(MailingContacts);

    }

    async CreateMailingList(mailingListName : string, mailingListData: MailingListInputDto) {
        const mailingList = this.mailingListRepository.create({ mailingListName })
        await this.mailingListRepository.save(mailingList)
        mailingListData.mailingContacts.map(async (mailingContact) => {
            const mailingContacts = this.mailingContactsRepository.create({
                contactName: mailingContact.contactName,
                contactNo: mailingContact.contactNo,
                mailingList
            })
            await this.mailingContactsRepository.save(mailingContacts)
        })
        return mailingList
    }

    async findMailingListById(mailingListId: string): Promise<MailingList | null> {
        return await this.mailingListRepository.findOne({ 
            where: { id: mailingListId },
            relations: ['mailingContacts'] 
        })
    }

    async findAllMailingList(): Promise<MailingList[]> {
        const mailinglist = await this.mailingListRepository.find({
            relations : ['mailingContacts'],
            order : { createdAt : 'ASC' }
        })

        return mailinglist
    }

   
    async findAllContactsOfMailingList(mailingListId: string): Promise<MailingContacts[]> {
        const mailinglist = await this.mailingContactsRepository.find(
            {
                where: { mailingList: { id: mailingListId } },
                relations: ['mailingList']
            }
        )
        return mailinglist
    }

    async findMailingContactByContactNo(contactNo: string, mailingListId: string) {
        return await this.mailingContactsRepository.findOne({
            where: {
                contactNo,
                mailingList: { id: mailingListId }
            }
        })
    }

    async findAllMailingContactByMailingListId(mailingListId : string) {
        return await this.mailingContactsRepository.find({ 
            where : { mailingList : { id : mailingListId }},
            order : { createdAt: 'ASC'}
        })
    }
     async findMailingListByName(mailingListName: string) {
        return await this.mailingListRepository.findOne({ where: { mailingListName}})
    }


    async saveMailingContact(saveMailingContact : MailingContact) {
        const mailingContact = await this.mailingContactsRepository.findOne({ where : { id: saveMailingContact.id }})
        if(!mailingContact) throw new Error('mailing List contact doesnt exist');
        mailingContact.contactName = saveMailingContact.contactName;
        mailingContact.contactNo = saveMailingContact.contactNo;
        await this.mailingContactsRepository.save(mailingContact);
        await mailingContact
    }


    async deleteMailingContact (mailingContactId : string){
        return await this.mailingContactsRepository.delete({ id: mailingContactId })
    }

    
}