import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver, Parent, ResolveField } from "@nestjs/graphql";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from "src/modules/workspace/workspace.entity";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { WorkspaceResponceDTO } from "src/modules/workspace/dto/WorkspaceResponceDTO";
import { WorkspaceUpdateInputDto } from "src/modules/workspace/dto/WorkspaceUpdateInputDto";
import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { FileService } from "src/modules/file/services/file.service";
import { FileStorageService } from "src/modules/file-storage/file-storage.service";
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
import { User } from 'src/modules/user/user.entity';
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { RolesGuard } from "src/modules/auth/guards/roles.guard";


@Resolver(() => Workspace)
export class workspaceResolver {
  constructor(
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private workspaceService: WorkspaceService,
    private fileService: FileService,
    private fileStorageService: FileStorageService,
    private readonly domainManagerService: DomainManagerService,
  ) { }

  @Mutation(() => String, { name: 'generateWorkspaceInvitation' })
  @UseGuards(GqlAuthGuard)
  async generateWorkspaceInvitation(
    @Args('workspaceId', { type: () => String }) workspaceId: string,
    @Context() context: any,
  ): Promise<string> {
    const userId = context.req.user.id;
    return this.workspaceService.generateInvitationLink(workspaceId, userId);
  }
  
  @Mutation(() => WorkspaceResponceDTO)
  @UseGuards(GqlAuthGuard)
  async updateWorkspaceDetails(
    @AuthWorkspace() workspace: Workspace,
    @Args('WorkspaceUpdateInput') WorkspaceUpdateInput: WorkspaceUpdateInputDto,
  ): Promise<WorkspaceResponceDTO> {
    return this.workspaceService.updateWorkspaceDetails(workspace.id, WorkspaceUpdateInput.workspaceName, WorkspaceUpdateInput?.profileImg);
  }

  @ResolveField(() => String)
  async profileImg(@Parent() workspace: Workspace): Promise<string> {
    if (workspace.profileImg) {
      try {
        return this.fileService.signFileUrl({
          url: workspace.profileImg,
          workspaceId: workspace.id,
        });
      } catch (e) {
        return workspace.profileImg;
      }
    }
    return workspace.profileImg ?? '';
  }

  @ResolveField(() => String)
  async inviteToken(@Parent() workspace: Workspace): Promise<string> {
    if (workspace.inviteToken) {
      const link = this.domainManagerService.buildWorkspaceURL({
        pathname: `invite/${workspace?.inviteToken}`,
      });
      return link.toString()
    }
    return '';
  }

  @Roles(Role.ADMIN)
  @Query(() => Workspace)
  @UseGuards(GqlAuthGuard,RolesGuard)
  async getWorkspaceMember(
    @AuthUser() { id: userId }: User,
    @AuthWorkspace() workspace: Workspace,
  ): Promise<Workspace> {
    const workspaces = await this.workspaceRepository.findOne({
        where: {
          id: workspace.id,
        },
        relations: ['members', 'members.user'],
        order: {
          members: {
            userId: 'ASC', // Order by the 'name' property of the 'singer' relation in ascending order
          },
        },
      });
    if (!workspaces) {
      throw new Error('Workspace member not found');
    }
    return workspaces
  }

}