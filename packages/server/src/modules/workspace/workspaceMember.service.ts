import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { UserService } from "../user/user.service";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceInvitation } from "./workspaceInvitation.entity";
import { v4 as uuidv4 } from 'uuid';
import { ContactsService } from "../contacts/contacts.service";
import { Contacts } from "../contacts/contacts.entity";
import { Role } from 'src/enums/role.enum';

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember, 'core')
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private readonly workspaceService: WorkspaceService,
  ) { }

  async create(userId: string, workspaceId: string): Promise<WorkspaceMember> {
    // const user = userId;
    // const workspace = this.workspaceService.findWorkspaceById(workspaceId);
    const userWorkspace = this.workspaceMemberRepository.create({
      userId,
      workspaceId,
    });

    // this.workspaceEventEmitter.emitCustomBatchEvent(
    //   USER_SIGNUP_EVENT_NAME,
    //   [{ userId }],
    //   workspaceId,
    // );

    return this.workspaceMemberRepository.save(userWorkspace);
  }


}