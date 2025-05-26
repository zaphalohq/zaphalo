import { Injectable, NotFoundException } from "@nestjs/common";
import { In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { MailingList } from "./mailingList.entity";
import { ContactsService } from "../contacts/contacts.service";
import { UserService } from "../user/user.service";
import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import axios, { AxiosResponse } from "axios"
import fs from "fs"
import { WorkspaceService } from "../workspace/workspace.service";
import { MailingListInputDto } from "./DTO/MailingListReqDto";
import { MailingContacts } from "./mailingContacts.entity";


@Injectable()
export class MailingListService {
    constructor(
        @InjectRepository(MailingList, 'core')
        private mailingListRepository: Repository<MailingList>,
        @InjectRepository(MailingContacts, 'core')
        private mailingContactsRepository: Repository<MailingContacts>,
        private readonly workspaceService: WorkspaceService,
    ) { }

    async CreateMailingList(mailingListInput : MailingListInputDto, workspaceId: string) {
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")
        const mailingListName = `ListName-${Math.floor(Math.random() * 9000) + 1000}`;
        const mailingList = this.mailingListRepository.create({ mailingListName,workspace})
        await this.mailingListRepository.save(mailingList)

        mailingListInput.mailingContacts.map( async (mailingContact) => {
        const mailingContacts = this.mailingContactsRepository.create({...mailingContact, mailingList})
        await this.mailingContactsRepository.save(mailingContacts)
        })


        return mailingList
    }

    async findAllMailingList(workspaceId: string): Promise<MailingList[]> {
        const mailinglist = await this.mailingListRepository.find({ where : { workspace : { id : workspaceId}}})
        console.log(mailinglist,"........................");
        
        return mailinglist
    }


}