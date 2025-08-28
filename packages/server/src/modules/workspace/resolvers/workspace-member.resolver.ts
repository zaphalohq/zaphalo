import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver, Parent, ResolveField } from "@nestjs/graphql";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


import { GqlAuthGuard } from "src/modules/auth/guards/gql-auth.guard";
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';


@UseGuards(GqlAuthGuard)
@Resolver(() => WorkspaceMember)
export class workspaceMemberResolver {
  constructor(
    @InjectRepository(WorkspaceMember, 'core')
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) { }

  // @Roles(Role.USER)
  // @UseGuards(RolesGuard)
  @Mutation(() => WorkspaceMember)
  async updateUserRole(
    @AuthWorkspace() workspace: WorkspaceMember,
    @Args('userId') userId: string,
    @Args('role') role: Role): Promise<WorkspaceMember> {
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
      },
      relations: ['user'],
    });

    if (!workspaceMember) {
      throw new Error('Current user not found');
    }
    Object.assign(workspaceMember, {role});
    await this.workspaceMemberRepository.save(workspaceMember);
    return workspaceMember
  }

  @Mutation(() => WorkspaceMember)
  async deleteWorkspaceMember(
    @AuthWorkspace() workspace: WorkspaceMember,
    @Args('userId') userId: string): Promise<WorkspaceMember> {

    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
      },
      relations: ['user'],
    });

    if (!workspaceMember) {
      throw new Error('Current user not found');
    }
    Object.assign(workspaceMember, {deletedAt: new Date()});
    await this.workspaceMemberRepository.save(workspaceMember);
    return workspaceMember
  }

  @Mutation(() => WorkspaceMember)
  async suspendWorkspaceMember(
    @AuthWorkspace() workspace: WorkspaceMember,
    @Args('userId') userId: string): Promise<WorkspaceMember> {

    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
      },
      relations: ['user'],
    });

    if (!workspaceMember) {
      throw new Error('Current user not found');
    }
    Object.assign(workspaceMember, {active: false});
    await this.workspaceMemberRepository.save(workspaceMember);
    return workspaceMember
  }

}