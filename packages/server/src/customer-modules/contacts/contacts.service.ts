import { Inject, Injectable } from "@nestjs/common";
import { Contacts } from "./contacts.entity";
import { createContactsDto } from "./dto/createContactsDto";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, In, Like, Repository } from 'typeorm';
import { updateContactsDto } from "./dto/updateContactsDto";
import { throwError } from "rxjs";
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ContactsService {
    private contactsRepository: Repository<Contacts>

    constructor(
        @Inject(CONNECTION) connection: Connection,
        private eventEmitter: EventEmitter2
    ) {
        this.contactsRepository = connection.getRepository(Contacts);
    }

    async findOneContact(senderId) {
        return await this.contactsRepository.findOne({ where: { phoneNo: senderId } })
    }

    async searchReadContacts(search: string, filter: string, page: number, pageSize: number) {

        const skip = (page - 1) * pageSize;

        const where: any = {};
        if (search) {
            where.contactName = Like(`%${search}%`);
        }
        if (filter) {
            where.contactName = filter;
        }
        const [result, total] = await this.contactsRepository.findAndCount({
            where,
            order: { createdAt: 'ASC' },
            take: pageSize,
            skip,
        });
        const totalPages = Math.ceil(total / pageSize);
        return {
            contacts: result,
            total: total,
            currentPage: page,
            totalPages: totalPages,
        };
    }

    async getContactbyId(contactId: string) {
        return await this.contactsRepository.findOne({ where: { id: contactId } })
    }

    async createContacts(CreateContacts: createContactsDto) {
        const existContact = await this.findOneContact(CreateContacts.phoneNo)
        if (existContact)
            return existContact
        const createdContacts = this.contactsRepository.create({
            contactName: CreateContacts.contactName,
            phoneNo: CreateContacts.phoneNo,
            profileImg: CreateContacts.profileImg,
            street: CreateContacts.street,
            city: CreateContacts.city,
            country: CreateContacts.country,
            state: CreateContacts.state,
            zipcode: CreateContacts.zipcode
        });
        await this.contactsRepository.save(createdContacts);
        return createdContacts
    }

    async findAllContacts(): Promise<Contacts[]> {

        return await this.contactsRepository.find({
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

    async UpdateContact(workspace, UpdateContact: updateContactsDto) {
        const updateContact = await this.contactsRepository.findOne({ where: { id: UpdateContact.id } })
        if (!updateContact) throw Error("contact doesn't found.")

        try {

            updateContact.contactName = UpdateContact.contactName;
            updateContact.phoneNo = UpdateContact.phoneNo;
            updateContact.street = UpdateContact.street;
            updateContact.city = UpdateContact.city;
            updateContact.country = UpdateContact.country;
            updateContact.state = UpdateContact.state;
            updateContact.profileImg = UpdateContact.profileImg;
            updateContact.zipcode = UpdateContact.zipcode;

            const savedContact = await this.contactsRepository.save(updateContact);

            this.eventEmitter.emit('contact.updated', {
                workspaceId: workspace.id,
                phoneNo: savedContact.phoneNo,
                contactName: savedContact.contactName,
            })
            return savedContact
        } catch (err) {
            console.log(err);
        }

    }

    async DeleteContact(contactIds: string[]) {
        const contacts = await this.contactsRepository.find({
            where: {
                id: In(contactIds)
            }
        });
        if (contacts.length === 0) {
            return {
                'message': 'No contacts found to delete',
                'status': false
            }
        }

        await this.contactsRepository.remove(contacts);

        return {
            'message': 'Contacts deleted',
            'status': true
        }

    }

    async findActiveContactOrCreate(senderMobile, senderName) {
        const existingContact = await this.contactsRepository.findOne({
            where: { phoneNo: senderMobile }
        })

        if (!existingContact) {
            const createdContacts = this.contactsRepository.create({
                contactName: senderName,
                phoneNo: senderMobile,
            })
            await this.contactsRepository.save(createdContacts);
            return createdContacts
        }
        return existingContact
    }

    async findContactByChannleId(channelId: string) {
        return await this.contactsRepository
            .createQueryBuilder('contact')
            .leftJoin('contact.channel', 'channel')
            .where('channel.id = :channelId', { channelId })
            .getOne();
    }

}