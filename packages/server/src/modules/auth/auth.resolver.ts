import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthInput } from './dto/auth.input';
import { AuthService } from './services/auth.service';
import { User } from 'src/modules/user/user.entity';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { LoginToken } from 'src/modules/auth/dto/login-token.entity';
import { ApiKeyToken, AuthTokens } from 'src/modules/auth/dto/token.entity';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';
import { LoginTokenService } from 'src/modules/auth/token/services/login-token.service';


@Resolver()
export class AuthResolver {
  constructor(
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
    private readonly workspaceService: WorkspaceService,
    private loginTokenService: LoginTokenService,
  ) { }

  @Mutation(() => LoginToken)
  async login(@Args('authInput') authInput: AuthInput): Promise<LoginToken> {
    const user = await this.authService.validateUser(authInput.email, authInput.password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const workspace = user.workspaceMembers ? user.workspaceMembers[0].workspace : null
    if (!workspace){
      throw new Error("User workspace does not setup.");
    }
    const loginToken = await this.loginTokenService.generateLoginToken(
      user.email,
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
}