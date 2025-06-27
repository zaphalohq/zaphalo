import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthInput } from './dto/auth.input';
import { AuthToken } from './dto/auth.token';
import { AuthResponse } from './dto/auth.response';
import { CreateUserDTO } from '../user/dto/create-user.dto';
import { RegisterResponse } from './dto/register.response';
import { log } from 'console';
import { User } from '../user/user.entity';
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { WorkspaceService } from '../workspace/workspace.service';


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly workspaceService: WorkspaceService){}

  @Mutation(() => AuthResponse)
  async login(@Args('authInput') authInput: AuthInput) {
    const user = await this.authService.validateUser(authInput.email, authInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    return this.authService.login(user, authInput?.inviteToken);
  }

  @Mutation(() => User)
  async Register(@Args('Register') Register: CreateUserDTO) {
    const user = await this.authService.Register(Register);

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const inviteToken = Register.inviteToken

    if (inviteToken) {
      const userId = await user.id
      await this.workspaceService.getOrCreateWorkspaceForUser(userId, inviteToken)
    }
    return user
  }


  @Mutation(() => AuthResponse)
  async getAuthTokensFromLoginToken(
    @Args('loginToken') loginToken: string,
    // @OriginHeader() origin: string,
  ) {
    return this.authService.verifyToken(loginToken)
  }
}