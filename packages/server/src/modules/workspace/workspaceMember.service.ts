import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { UserService } from "../user/user.service";
import { User } from "../user/user.entity";
import { WorkspaceService } from "./workspace.service";

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

    // this.workspaceEventEmitter.emitCustomBatchEvent(
    //   USER_SIGNUP_EVENT_NAME,
    //   [{ userId }],
    //   workspaceId,
    // );

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

      // await this.createWorkspaceMember(workspace.id, user);

      // const defaultRoleId = workspace.defaultRoleId;

      // if (!isDefined(defaultRoleId)) {
      //   throw new PermissionsException(
      //     PermissionsExceptionMessage.DEFAULT_ROLE_NOT_FOUND,
      //     PermissionsExceptionCode.DEFAULT_ROLE_NOT_FOUND,
      //   );
      // }

      // await this.userRoleService.assignRoleToUserWorkspace({
      //   workspaceId: workspace.id,
      //   userWorkspaceId: userWorkspace.id,
      //   roleId: defaultRoleId,
      // });

      // await this.workspaceInvitationService.invalidateWorkspaceInvitation(
      //   workspace.id,
      //   user.email,
      // );
    }
  }


}