import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { WorkspaceService } from "./workspace.service";
import { User } from "src/modules/user/user.entity";
import { Role } from "src/enums/role.enum";

@Injectable()
export class WorkspaceMemberService {
  constructor(
    @InjectRepository(WorkspaceMember, 'core')
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    private readonly workspaceService: WorkspaceService,
  ) { }


  async checkUserWorkspaceExists(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMember | null> {
    return this.workspaceMemberRepository.findOneBy({
      userId,
      workspaceId,
    });
  }

  async create(userId: string, workspaceId: string, role?: Role): Promise<WorkspaceMember> {
    const user = userId;
    const workspace = this.workspaceService.findWorkspaceById(workspaceId);

    const createData: Partial<WorkspaceMember> = {
      userId,
      workspaceId,
    };
  
    if (role !== undefined) {
      createData.role = role;
    }

    const userWorkspace = this.workspaceMemberRepository.create(createData);
    return this.workspaceMemberRepository.save(userWorkspace);
  }

  async addUserToWorkspaceIfUserNotInWorkspace(
    user: User,
    workspace: Workspace,
  ) {
    let userWorkspace = await this.checkUserWorkspaceExists(
      user.id,
      workspace.id,
    );

    if (!userWorkspace) {
      userWorkspace = await this.create(user.id, workspace.id, Role.USER);
    }
  }

}