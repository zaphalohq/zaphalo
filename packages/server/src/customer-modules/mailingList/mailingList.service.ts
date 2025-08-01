import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { MailingList } from "./mailingList.entity";
import { MailingContact, MailingListInputDto } from "./DTO/MailingListReqDto";
import { MailingContacts } from "./mailingContacts.entity";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, ILike, Repository } from 'typeorm';
import { FindAllMailingListRes } from "./DTO/FindAllMailingListDto";
import { serialize } from "v8";


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

    async CreateMailingList(mailingListName: string, mailingListData: MailingListInputDto) {
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

    async findAllMailingList(currentPage, itemsPerPage): Promise<FindAllMailingListRes> {
        const totalItems = await this.mailingListRepository.count();
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const mailingList = await this.mailingListRepository.find({
            relations: ['mailingContacts'],
            order: { createdAt: 'ASC' },
            skip: startIndex,
            take: itemsPerPage
        })

        return { mailingList, totalPages }
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

    async findAllMailingContactByMailingListId(mailingListId: string) {
        return await this.mailingContactsRepository.find({
            where: { mailingList: { id: mailingListId } },
            order: { createdAt: 'ASC' }
        })
    }

    async selectedMailingContact(mailingListId: string, currentPage: number, itemsPerPage: number) {
        const totalItems = await this.mailingContactsRepository.count({ where: { mailingList: { id: mailingListId } } });
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (currentPage - 1) * itemsPerPage;
        const mailingContact = await this.mailingContactsRepository.find({
            where: { mailingList: { id: mailingListId } },
            order: { createdAt: 'ASC' },
            skip: startIndex,
            take: itemsPerPage,
        })

        console.log(startIndex, "...........................");

        return {
            mailingContact,
            totalPages
        }
    }


    async searchAndPaginateContact(
        mailingListId: string,
        searchTerm?: string,
    ) {
        const [mailingContact, totalCount] = await this.mailingContactsRepository.findAndCount({
            where: searchTerm ? [
                { mailingList: { id: mailingListId }, contactName: ILike(`%${searchTerm}%`) },
                { mailingList: { id: mailingListId }, contactNo: ILike(`%${searchTerm}%`) },
            ] : { mailingList: { id: mailingListId } },
            order: { createdAt: 'ASC' },
        });

        return { mailingContact, totalCount };
    }

    async findMailingListByName(mailingListName: string) {
        return await this.mailingListRepository.findOne({ where: { mailingListName } })
    }


    async saveMailingContact(saveMailingContact: MailingContact) {
        const mailingContact = await this.mailingContactsRepository.findOne({ where: { id: saveMailingContact.id } })
        if (!mailingContact) throw new Error('mailing List contact doesnt exist');
        mailingContact.contactName = saveMailingContact.contactName;
        mailingContact.contactNo = saveMailingContact.contactNo;
        await this.mailingContactsRepository.save(mailingContact);
        await mailingContact
    }


    async deleteMailingContact(mailingContactId: string) {
        return await this.mailingContactsRepository.delete({ id: mailingContactId })
    }

    async searchMailingList(
        searchTerm?: string,
    ) {
        console.log(searchTerm,'searchTerm................');
        
        const [mailingList, totalCount] = await this.mailingListRepository.findAndCount({
            where: { mailingListName: ILike(`%${searchTerm}%`) },
            order: { createdAt: 'ASC' },
            relations: ['mailingContacts']
        });
        console.log(mailingList,'mailingList');
        
        return { searchedData: mailingList, totalCount };
    }


}