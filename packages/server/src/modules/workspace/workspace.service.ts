import { Injectable } from "@nestjs/common";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { WorkspaceInvitation } from "./workspaceInvitation.entity";
import { v4 as uuidv4 } from 'uuid';
import { Role } from 'src/enums/role.enum';
import { UserService } from "src/modules/user/user.service";
import { TypeORMService } from 'src/database/typeorm/typeorm.service';



@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(Workspace, 'core')
    private workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember, 'core')
    private workspaceMemberRepository: Repository<WorkspaceMember>,
    @InjectRepository(WorkspaceInvitation, 'core')
    private invitationRepository: Repository<WorkspaceInvitation>,
    private readonly userService: UserService,
    private readonly typeormService: TypeORMService,
  ) { }


  async generateInvitationLink(workspaceId: string, userId: string): Promise<string> {
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const token = uuidv4();
    const invitation = this.invitationRepository.create({
      token,
      workspace,
      invitedBy: user,
    });
    await this.invitationRepository.save(invitation);

    return `http://localhost:5173/invite/${token}`;
  }

  async acceptInvitation(token: string, userId: string): Promise<Workspace> {
    const invitation = await this.invitationRepository.findOne({
      where: { token, isUsed: false },
      relations: ['workspace'],
    });

    if (!invitation) {
      throw new Error('Invalid or expired invitation');
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const existingMembership = await this.workspaceMemberRepository.findOne({
      where: { user: { id: userId }, workspace: { id: invitation.workspace.id } },
    });

    if (existingMembership) {
      return existingMembership.workspace[0];
    }
    const membership = this.workspaceMemberRepository.create({
      user,
      workspace: invitation.workspace,
      role: Role.USER,
    });
    await this.workspaceMemberRepository.save(membership);

    invitation.isUsed = true;
    await this.invitationRepository.save(invitation);

    return invitation.workspace;
  }

  async getOrCreateWorkspaceForUser(userId: string, invitationToken?: string): Promise<Workspace[]> {
    if (invitationToken) {
      const invitedWorkspace = await this.acceptInvitation(invitationToken, userId);
      const memberships = await this.workspaceMemberRepository.find({
        where: { user: { id: userId } },
        relations: ['workspace'],
      });
      return memberships.map((membership) => membership.workspace).flat();
    }

    const memberships = await this.workspaceMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });

    const workspaces = memberships.map((membership) => membership.workspace).flat();
    if (workspaces.length > 0) {
      return workspaces;
    }

    const user = await this.userService.findByUserId(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const workspace = this.workspaceRepository.create({
      name: `${user.firstName}'s Workspace`,
      owner: user,
      inviteToken: uuidv4(),
    });
    await this.workspaceRepository.save(workspace);
    const membership = this.workspaceMemberRepository.create({
      user,
      workspace: workspace,
      role: Role.ADMIN,
    });
    await this.workspaceMemberRepository.save(membership);
    return [workspace];
  }



  async findWorkspaceById(workspaceId) {
    return await this.workspaceRepository.findOne({ where: { id: workspaceId } });
  }

  async createWorkspaceSchema(workspace: Workspace): Promise<Workspace> {
    const schemaName = `workspace_${workspace.id}`;
    await this.typeormService.createSchema(schemaName);
    const workspaceDataSource = await this.typeormService.getWorkspaceConnection(schemaName);
    await workspaceDataSource.runMigrations()
    await workspaceDataSource.close();
    return workspace
  }


  async updateWorkspaceDetails(workspaceId: string, workspaceName: string, profileImg?: string) {
    console.log("............workspaceid");
    
    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } })
    if (!workspace) throw Error('workspace not found');
    workspace.name = workspaceName;
    if(profileImg) workspace.profileImg = profileImg;
    workspace.isWorkspaceSetup = true;
    await this.workspaceRepository.save(workspace)
    return workspace
  }

}