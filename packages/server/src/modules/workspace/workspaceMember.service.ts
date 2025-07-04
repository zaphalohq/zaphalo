import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { WorkspaceService } from "./workspace.service";
import { User } from "src/modules/user/user.entity";

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

  async create(userId: string, workspaceId: string): Promise<WorkspaceMember> {
    const user = userId;
    const workspace = this.workspaceService.findWorkspaceById(workspaceId);
    const userWorkspace = this.workspaceMemberRepository.create({
      userId,
      workspaceId,
    });
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
      userWorkspace = await this.create(user.id, workspace.id);
    }
  }


}