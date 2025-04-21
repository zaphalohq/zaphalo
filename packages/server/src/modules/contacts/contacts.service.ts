import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Contacts } from "./contacts.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { createContactsDto } from "./dto/createContactsDto";
import { log } from "console";
import { workspaceService } from "../workspace/workspace.service";

@Injectable()
export class contactsService {
    constructor(
        @InjectRepository(Contacts, 'core')
        private contactsRepository: Repository<Contacts>,
        private readonly workspaceService: workspaceService,

    ) { }

    async findOneContact(senderId: number, workspaceId?) {
        return await this.contactsRepository.findOne({ where: { phoneNo: senderId, workspace : { id : workspaceId} } },)
    }

    async createContacts(CreateContacts: createContactsDto, workspaceId : string | undefined) {
        const existContact = await this.findOneContact(CreateContacts.phoneNo, workspaceId)
        if (existContact) 
            return existContact

        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")

        const createdContacts = this.contactsRepository.create({
            contactName : CreateContacts.contactName,
            phoneNo : CreateContacts.phoneNo,
            profileImg : CreateContacts.profileImg,
            workspace
        });        
        await this.contactsRepository.save(createdContacts);
        return createdContacts;
    }


    async findAllContacts(workspaceId : string): Promise<Contacts[]> {

        return await this.contactsRepository.find({
            where: { workspace : { id: workspaceId}},
            order: { createdAt: 'ASC' }, // Sort by creation time
        });
    }

    async findContactsByPhoneNoArr(memberIds: any, workspaceId : string) {
        return await this.contactsRepository.find({
            where: memberIds.map(phoneNo => ({ 
                phoneNo,
                workspace : { id : workspaceId }
             })),
            // relations : ['channel']
        },
        )

    }




}