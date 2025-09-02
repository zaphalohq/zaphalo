import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthWorkspace } from "src/decorators/auth-workspace.decorator";
import { WorkspaceAuthGuard } from "src/guards/workspace-auth.guard";
import { WorkspaceInvitationService } from "src/modules/workspace-invitation/services/workspace-invitation.service";

import { Workspace } from "src/modules/workspace/workspace.entity";
import { SendInvitationsOutput } from 'src/modules/workspace-invitation/dtos/send-invitations.output';
import { SendInvitationsInput } from 'src/modules/workspace-invitation/dtos/send-invitations.input';
import { WorkspaceInvitation } from 'src/modules/workspace-invitation/dtos/workspace-invitation.dto';

import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { User } from 'src/modules/user/user.entity';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';


@UseGuards(GqlAuthGuard)
@Resolver()
export class WorkspceInvitationResolver{
  constructor(
    @InjectRepository(WorkspaceMember, 'core')
    private readonly workspaceMemebrRepository: Repository<WorkspaceMember>,
    private readonly workspaceInvitationService: WorkspaceInvitationService,
  ){}

  @Query(() => [WorkspaceInvitation])
  async findWorkspaceInvitations(@AuthWorkspace() workspace: Workspace) {
    return this.workspaceInvitationService.loadWorkspaceInvitations(workspace);
  }

  @Mutation(() => String)
  async deleteWorkspaceInvitation(
    @Args('appTokenId') appTokenId: string,
    @AuthWorkspace() { id: workspaceId }: Workspace,
  ){
    console.log("...............appTokenId...............", appTokenId);
    return this.workspaceInvitationService.deleteWorkspaceInvitation(
      appTokenId,
      workspaceId
    )
  }

  @Mutation(() => SendInvitationsOutput)
  @UseGuards(UserAuthGuard)
  async sendInvitations(
    @Args() sendInviteLinkInput: SendInvitationsInput,
    @AuthUser() user: User,
    @AuthWorkspace() workspace: Workspace,
  ): Promise<SendInvitationsOutput> {
    let workspaceLogoWithToken = '';

    if (workspace.profileImg) {
      workspaceLogoWithToken = workspace.profileImg
      // workspaceLogoWithToken = this.fileService.signFileUrl({
      //   url: workspace.profileImg,
      //   workspaceId: workspace.id,
      // });
    }


    const workspaceMember = await this.workspaceMemebrRepository.findOneOrFail({
      where: {
        userId: user.id,
      },
    });

    return await this.workspaceInvitationService.sendInvitations(
      sendInviteLinkInput.emails,
      { ...workspace, profileImg: workspaceLogoWithToken },
      workspaceMember,
    );
  }

}