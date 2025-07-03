import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailingList } from "./mailingList.entity";
import { MailingListInputDto } from "./DTO/MailingListReqDto";
import { MailingContacts } from "./mailingContacts.entity";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { CONNECTION } from 'src/modules/workspace-manager/workspace.manager.symbols';
import { Connection, Repository } from 'typeorm';


@Injectable()
export class MailingListService {
            private mailingListRepository: Repository<MailingList>
        private mailingContactsRepository: Repository<MailingContacts>
    constructor(
        @Inject(CONNECTION) connection: Connection,
        private readonly workspaceService: WorkspaceService,
      ) {
        this.mailingListRepository = connection.getRepository(MailingList);
      }
    async CreateMailingList(mailingListData: MailingListInputDto, workspaceId: string) {
        const workspace = await this.workspaceService.findWorkspaceById(workspaceId)
        if (!workspace) throw new Error("workspace doesnt found")
        const mailingListName = `ListName-${Math.floor(Math.random() * 9000) + 1000}`;
        const mailingList = this.mailingListRepository.create({ mailingListName,
            //  workspace 
            })
        await this.mailingListRepository.save(mailingList)
        console.log(mailingListData,".df.........................................");
        
        mailingListData.mailingContacts.map(async (mailingContact) => {
            const mailingContacts = this.mailingContactsRepository.create({ ...mailingContact, mailingList })
            await this.mailingContactsRepository.save(mailingContacts)
        })


        return mailingList
    }

    async findMailingListById(mailingListId: string) : Promise<MailingList | null> {
        return await this.mailingListRepository.findOne({ where: { id: mailingListId }})
    }

    async findAllMailingList(workspaceId: string): Promise<MailingList[]> {
        const mailinglist = await this.mailingListRepository.find(
            { 
                // where: { workspace: { id: workspaceId } },
            })
        console.log(mailinglist, "........................");

        return mailinglist
    }

    async findAllContactsOfMailingList(mailingListId: string): Promise<MailingContacts[]> {
        const mailinglist = await this.mailingContactsRepository.find(
            { 
                where: { mailingList: { id: mailingListId }},
                relations: ['mailingList']
             }
        )
        return mailinglist
    }

    async findMailingContactByContactNo(contactNo: string, mailingListId: string){
        return await this.mailingContactsRepository.findOne({ where: { 
            contactNo,
            mailingList: { id: mailingListId}
        }})
    }

}