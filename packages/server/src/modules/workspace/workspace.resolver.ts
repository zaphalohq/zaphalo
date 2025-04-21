import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthGuard } from "../auth/guards/gql-auth.guard";
import { Workspace } from "./workspace.entity";
import { workspaceService } from "./workspace.service";

// WorkspaceResolver
@Resolver(() => Workspace)
export class workspaceResolver {
  constructor(private workspaceService: workspaceService) { }

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
}