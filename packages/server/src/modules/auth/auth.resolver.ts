import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './services/auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthToken } from './dto/auth.token';
import { AuthResponse } from './dto/auth.response';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { RegisterResponse } from './dto/register.response';
import { log } from 'console';
import { User } from '../user/user.entity';
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Resolver()
export class AuthResolver {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly workspaceService: WorkspaceService) { }

  @Mutation(() => String)
  async login(@Args('authInput') authInput: AuthInput) {
    const user = await this.authService.validateUser(authInput.email, authInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log("......................user.workspaces..................", user.workspaces);
    const workspace = user.workspaces ? user.workspaces[0].workspace : null
    if (!workspace){
      throw new Error("User workspace does not setup.");
    }
    const loginToken = await this.authService.generateLoginToken(
      user.email,
      workspace.id,
    );
    return loginToken.token;
  }

  @Mutation(() => User)
  async Register(@Args('Register') UserInput: CreateUserDTO) {

    const {
      firstName,
      lastName,
      email,
      password,
      // picture,
      workspaceId,
      workspaceInviteToken,
      // local,
    } = UserInput;


    const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
      workspaceId,
      workspaceInviteToken,
      email,
      authProvider: 'password',
    });
    // try {
      const invitation =
        currentWorkspace && email
          ? await this.authService.findSignInUpInvitation({
            currentWorkspace,
            email,
          })
          : undefined;

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      const { userData } = this.authService.formatUserDataPayload(
        {
          firstName,
          lastName,
          email,
          // picture,
          // locale,
        },
        existingUser,
      );

      // await this.authService.checkSignInAccess({
      //   userData,
      //   invitation,
      //   workspaceInviteHash,
      //   workspace: currentWorkspace,
      // });

      const { user, workspace } = await this.authService.signInUp({
        // invitation,
        workspace: currentWorkspace,
        userData,
        authParams: {
          provider: 'password',
          password: password,
        },
      });

      const loginToken = await this.authService.generateLoginToken(
        email,
        workspace.id,
      );

      return user

    // }
    // catch (err) {
    //   throw new Error('workspace creation error');
    // }
  }


  @Mutation(() => AuthResponse)
  async getAuthTokensFromLoginToken(
    @Args('loginToken') loginToken: string,
    // @OriginHeader() origin: string,
  ) {
    return this.authService.verifyToken(loginToken)
  }
}