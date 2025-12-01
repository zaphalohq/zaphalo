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
import { RolesGuard } from "src/modules/auth/guards/roles.guard";


@UseGuards(GqlAuthGuard)
@Resolver(() => WorkspaceMember)
export class workspaceMemberResolver {
  constructor(
    @InjectRepository(WorkspaceMember, 'core')
    private workspaceMemberRepository: Repository<WorkspaceMember>,
  ) { }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => WorkspaceMember)
  async updateUserRole(
    @AuthWorkspace() workspace: WorkspaceMember,
    @Args('userId') userId: string,
    @Args('role') role: Role): Promise<WorkspaceMember> {
    const [workspaceMembers, totalCount] = await this.workspaceMemberRepository.findAndCount({
      where: {
        workspaceId: workspace.id,
        role: Role.ADMIN
      },
      relations: ['user'],
    });
    if (totalCount < 2 && role == Role.USER){
      throw new Error('Workspace should have minimum one admin.');
    }
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
        workspaceId:workspace.id
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

    const [workspaceMembers, totalCount] = await this.workspaceMemberRepository.findAndCount({
      where: {
        workspaceId: workspace.id,
      },
      relations: ['user'],
    });

    if (totalCount < 2){
      throw new Error('Workspace should have minimum one user.');
    }
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
      },
      relations: ['user'],
    });
    if (!workspaceMember){
      throw new Error("Workspace member doesn't exist.");
    }
    const hasAdmin = workspaceMembers.some(member => member.role === 'admin' && member.id != workspaceMember.id);

    if (!hasAdmin){
      throw new Error('Workspace singal admin can not deleted.');
    }

    Object.assign(workspaceMember, {deletedAt: new Date()});
    await this.workspaceMemberRepository.save(workspaceMember);
    return workspaceMember
  }

  @Mutation(() => WorkspaceMember)
  async suspendWorkspaceMember(
    @AuthWorkspace() workspace: WorkspaceMember,
    @Args('userId') userId: string): Promise<WorkspaceMember> {
    const [workspaceMembers, totalCount] = await this.workspaceMemberRepository.findAndCount({
      where: {
        workspaceId: workspace.id,
      },
      relations: ['user'],
    });
    if (totalCount < 2){
      throw new Error('Workspace should have minimum one user.');
    }

    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId,
      },
      relations: ['user'],
    });

    if (!workspaceMember){
      throw new Error("Workspace member doesn't exist.");
    }
    const hasAdmin = workspaceMembers.some(member => member.role === 'admin' && member.id != workspaceMember.id);

    if (!hasAdmin){
      throw new Error('Workspace singal admin can not suspended.');
    }

    Object.assign(workspaceMember, {active: false});
    await this.workspaceMemberRepository.save(workspaceMember);
    return workspaceMember
  }

}