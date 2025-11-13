import {
  Resolver,
  Query,
  Args,
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
import { Role } from 'src/enums/role.enum';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { GqlAuthGuard } from 'src/modules/auth/guards/gql-auth.guard';
import { AuthWorkspace } from 'src/decorators/auth-workspace.decorator';
import { UserAuthGuard } from 'src/guards/user-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';

const getHMACKey = (email?: string, key?: string | null) => {
  if (!email || !key) return null;

  const hmac = crypto.createHmac('sha256', key);

  return hmac.update(email).digest('hex');
};

// @UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
  ) { }

  // @Roles(Role.ADMIN)
  // @UseGuards(RolesGuard)
  // @UseGuards(GqlAuthGuard)
  // @Query(() => [User])
  // async findAll(): Promise<User[]> {
  //   return this.userService.findAll();
  // }

  // @Query(() => User)
  // async findOneByUsername(@Args('username') username: string): Promise<User | null> {
  //   return this.userService.findOneByUsername(username);
  // }

  // @Query(() => User)
  // async findOneByEmail(email: string): Promise<User | null> {
  //   return this.userService.findOneByEmail(email)
  // }

  // @Mutation(() => User)
  // async createUser(@Args('CreateUserInput') CreateUserInput: CreateUserDTO): Promise<User> {
  //   return this.userService.createUser(CreateUserInput);
  // }

  @Query(() => User)
  @UseGuards(UserAuthGuard)
  async currentUser(
    @AuthUser() { id: userId }: User,
    @AuthWorkspace() workspace: Workspace,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['workspaceMembers', 'workspaceMembers.workspace'],
    });

    if (!user) {
      throw new Error('Current user not found');
    }

    const currentUserWorkspace = user.workspaceMembers.find(
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

  @Mutation(() => User)
  @UseGuards(UserAuthGuard)
  async updateUser(
    @Args('userData') userData: UpdateUserDTO
  ){
    const user= await this.userService.findOneByEmail(userData.email)

    if(!user){
      throw new Error("User Not Found")
    }

    user.firstName = userData.firstName;
    user.lastName= userData.lastName;

    const updatedUser = await this.userRepository.save(user);

    return updatedUser
  }
}
