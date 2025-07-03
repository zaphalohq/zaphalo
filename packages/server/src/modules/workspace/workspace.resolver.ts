import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Workspace } from "./workspace.entity";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceDashboardOutput } from "./dto/WorkspaceDashboardOutput";
import { WorkspaceUpdateInputDto } from "./dto/WorkspaceUpdateInputDto";
import { WorkspaceResponceDTO } from "./dto/WorkspaceResponceDTO";

// WorkspaceResolver
@Resolver(() => Workspace)
export class workspaceResolver {
  constructor(private workspaceService: WorkspaceService) { }

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
    return this.workspaceService.updateWorkspaceDetails(WorkspaceUpdateInput.workspaceId, WorkspaceUpdateInput.workspaceName, WorkspaceUpdateInput.profileImg);
  }

}