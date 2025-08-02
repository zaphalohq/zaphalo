import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver, Parent, ResolveField } from "@nestjs/graphql";
import { Workspace } from "./workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceResponceDTO } from "./dto/WorkspaceResponceDTO";
import { WorkspaceUpdateInputDto } from "./dto/WorkspaceUpdateInputDto";
import { WorkspaceDashboardOutput } from "./dto/WorkspaceDashboardOutput";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { FileService } from "src/modules/file-storage/services/file.service";


@Resolver(() => Workspace)
export class workspaceResolver {
  constructor(
    private workspaceService: WorkspaceService,
    private fileService: FileService
  ) { }

  @Query(() => [Workspace], { name: 'myWorkspaces' })
  @UseGuards(GqlAuthGuard)
  async getMyWorkspaces(
    @Context() context: any,
    @Args('invitationToken', { type: () => String, nullable: true }) invitationToken?: string,
  ): Promise<Workspace[]> {
    const userId = context.req.user.id;
    return this.workspaceService.getOrCreateWorkspaceForUser(userId, invitationToken);
  }

  @Mutation(() => String, { name: 'generateWorkspaceInvitation' })
  @UseGuards(GqlAuthGuard)
  async generateWorkspaceInvitation(
    @Args('workspaceId', { type: () => String }) workspaceId: string,
    @Context() context: any,
  ): Promise<string> {
    const userId = context.req.user.id;
    return this.workspaceService.generateInvitationLink(workspaceId, userId);
  }
  
  @Query(() => WorkspaceDashboardOutput)
  async findWorkspaceByIdForDash(@Args('workspaceId') workspaceId : string) {
    // return this.workspaceService.findWorkspaceByIdForDash(workspaceId)
  }

  @Mutation(() => WorkspaceResponceDTO)
  @UseGuards(GqlAuthGuard)
  async updateWorkspaceDetails(
    @Args('WorkspaceUpdateInput') WorkspaceUpdateInput: WorkspaceUpdateInputDto,
  ): Promise<WorkspaceResponceDTO> {
    return this.workspaceService.updateWorkspaceDetails(WorkspaceUpdateInput.workspaceId, WorkspaceUpdateInput.workspaceName, WorkspaceUpdateInput?.profileImg);
  }

  @ResolveField(() => String)
  async profileImg(@Parent() workspace: Workspace): Promise<string> {
    if (workspace.profileImg) {
      try {
        const workspaceLogoToken = this.fileService.encodeFileToken({
          workspaceId: workspace.id,
        });
        return `${workspace.profileImg}?token=${workspaceLogoToken}`;
      } catch (e) {
        return workspace.profileImg;
      }
    }

    return workspace.profileImg ?? '';
  }

}