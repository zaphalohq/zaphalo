import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { log } from "console";
import { Workspace } from "./workspace.entity";
import { WorkspaceMember } from "./workspaceMember.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class workspaceService {
    constructor(
        @InjectRepository(Workspace, 'core')
        private workspaceRepository: Repository<Workspace>,
        @InjectRepository(WorkspaceMember, 'core')
        private workspaceMemberRepository: Repository<WorkspaceMember>,
        private readonly userService: UserService

    ) { }




    // src/workspace/workspace.service.ts
async getOrCreateWorkspaceForUser(userId: string): Promise<Workspace[]> {
    // Find existing workspace memberships for the user
    const memberships = await this.workspaceMemberRepository.find({
      where: { user: { id: userId } },
      relations: ['workspace'],
    });
  
    // Return workspaces if any exist
    const workspaces = memberships.map((membership) => membership.workspace).flat();
    if (workspaces.length > 0) {
      return workspaces;
    }
  
   // If no workspaces exist, create a default one
   const user = await this.userService.findByUserId(userId);
   if (!user) {
       throw new Error('User not found');
   }
  
    // Create a new workspace with the owner set
    const workspace = this.workspaceRepository.create({
      name: `${user.username}'s Workspace`,
      description: 'Default workspace created on login',
      owner: user, // Set the owner field to the User entity
    });
    await this.workspaceRepository.save(workspace);
  
    // Create a workspace membership
    const membership = this.workspaceMemberRepository.create({
      user,
      workspace: [workspace],
      role: 'admin',
    });
    await this.workspaceMemberRepository.save(membership);
  
    return [workspace];
  }


  async findWorkspaceById (workspaceId) {
    return await this.workspaceRepository.findOne({ where : { id : workspaceId}});
  }

}