import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './services/auth.service';
import { User } from 'src/modules/user/user.entity';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { LoginToken } from 'src/modules/auth/dto/login-token.entity';
import { ApiKeyToken, AuthTokens } from 'src/modules/auth/dto/token.entity';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { LoginTokenService } from 'src/modules/auth/token/services/login-token.service';
import { RenewTokenService } from 'src/modules/auth/token/services/renew-token.service';
import { WorkspaceTokenService } from 'src/modules/auth/token/services/workspace-token.service';
import { CheckUserExistOutput } from './dto/user-exists.dto';


@Resolver()
export class AuthResolver {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly workspaceService: WorkspaceService,
    private loginTokenService: LoginTokenService,
    private renewTokenService: RenewTokenService,
    private workspaceTokenService: WorkspaceTokenService,
  ) { }

  // @UseGuards(CaptchaGuard, PublicEndpointGuard, NoPermissionGuard)
  @Query(() => CheckUserExistOutput)
  async checkUserExists(
    @Args('email') email: string,
  ): Promise<CheckUserExistOutput> {
    return await this.authService.checkUserExists(
      email.toLowerCase(),
    );
  }

  @Mutation(() => LoginToken)
  async login(@Args('authInput') authInput: AuthInput): Promise<LoginToken> {
    const {
      email,
      password,
      workspaceInviteToken,
    } = authInput;
    let existingUser;
    existingUser = await this.authService.validateUser(email, password);
    if (!existingUser) {
      throw new Error('Invalid credentials');
    }
    let workspace;
    workspace = existingUser.workspaceMembers ? existingUser.workspaceMembers[0].workspace : null

    if(authInput.workspaceInviteToken && existingUser){
      existingUser = await this.userRepository.findOne({
        where: { email },
      });
      const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
        workspaceInviteToken,
        email,
        authProvider: 'password',
      });

      const { user, workspace } = await this.authService.signInUp({
        workspace: currentWorkspace,
        userData: { type: 'existingUser', existingUser: existingUser },
        authParams: {
          provider: 'password',
          password: password,
        },
      });
      existingUser = user
    }
    if (!workspace){
      throw new Error("User workspace does not setup.");
    }
    const loginToken = await this.loginTokenService.generateLoginToken(
      existingUser.email,
      workspace.id,
    );
    return {loginToken};
  }

  @Mutation(() => User)
  async Register(@Args('Register') UserInput: CreateUserDTO) {
    const {
      firstName,
      lastName,
      email,
      password,
      workspaceId,
      workspaceInviteToken,
    } = UserInput;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if(existingUser) throw Error("email already exist")

    const currentWorkspace = await this.authService.findWorkspaceForSignInUp({
      workspaceId,
      workspaceInviteToken,
      email,
      authProvider: 'password',
    });
    try {
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
        },
        existingUser,
      );
      const { user, workspace } = await this.authService.signInUp({
        workspace: currentWorkspace,
        userData,
        authParams: {
          provider: 'password',
          password: password,
        },
      });

      const loginToken = await this.loginTokenService.generateLoginToken(
        email,
        workspace.id,
      );
      return user
    }
    catch (err) {
      throw new Error('workspace creation error');
    }
  }


  @Mutation(() => AuthTokens)
  async getAuthTokensFromLoginToken(
    @Args('loginToken') loginToken: string,
  ) {
    const {
      sub: email,
      workspaceId,
      authProvider,
    } = await this.loginTokenService.verifyLoginToken(
      loginToken,
    );
    return await this.authService.verify(email, workspaceId, authProvider);
  }

  @Mutation(() => AuthTokens)
  // @UseGuards(PublicEndpointGuard)
  async renewToken(@Args('appToken') appToken: string): Promise<AuthTokens> {
    const tokens = await this.renewTokenService.generateTokensFromRefreshToken(
      appToken,
    );
    return { tokens: tokens };
  }

  @Mutation(() => AuthTokens)
  // @UseGuards(PublicEndpointGuard)
  async workspaceToken(
    @Args('appToken') appToken: string,
    @Args('workspaceId') workspaceId: string): Promise<AuthTokens> {
    const tokens = await this.workspaceTokenService.generateTokensFromRefreshToken(
      appToken,
      workspaceId,
    );
    return { tokens: tokens };
  }
}