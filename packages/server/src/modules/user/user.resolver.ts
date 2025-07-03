import {
  Resolver,
  Query,
  Args,
  Parent,
  ResolveField,
  Mutation,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { promises } from 'fs';
import { userDTO } from './dto/user.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';


const getHMACKey = (email?: string, key?: string | null) => {
  if (!email || !key) return null;
  
  const hmac = crypto.createHmac('sha256', key);
  
  return hmac.update(email).digest('hex');
};
  // 

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
      // private readonly environmentService: EnvironmentService,
      // private readonly fileUploadService: FileUploadService,
    ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async findAll() : Promise<User[]>{
    return this.userService.findAll();
  }

  @Query(() => User)
  async findOneByUsername(@Args('username') username : string ) : Promise<User | null>{
    return this.userService.findOneByUsername(username);
  }

  @Query(() => User)
  async findOneByEmail( email : string) : Promise<User | null> {
    return this.userService.findOneByEmail(email)
  }

  @Mutation(() => User)
  async createUser(@Args('CreateUserInput') CreateUserInput : CreateUserDTO) : Promise<User> {
    return this.userService.createUser(CreateUserInput);
  }

  @Query(() => User)
  async currentUser(
    @AuthUser() { id: userId}: User,
    @AuthWorkspace() workspace: Workspace,
  ): Promise<User> {
    console.log("............................",userId);
    
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: ['workspaces', 'workspaces.workspace'],
      });

      if (!user) {
        throw new Error('Current user not found');
      }
      
      const currentUserWorkspace = user.workspaces.find(
        (userWorkspace) => userWorkspace.workspace.id === workspace.id,
      );

      if (!currentUserWorkspace) {
        throw new Error('Current user workspace not found');
      }
      user.currentUserWorkspace = currentUserWorkspace;
      
      return {
      ...user,
      currentWorkspace: workspace,
    };
  }
}
