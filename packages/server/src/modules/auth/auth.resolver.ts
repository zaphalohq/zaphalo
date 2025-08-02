import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthInput } from './dto/auth.input';
import { AuthResponse } from './dto/auth.response';
import { AuthService } from './services/auth.service';
import { User } from 'src/modules/user/user.entity';
import { CreateUserDTO } from 'src/modules/user/dto/create-user.dto';
import { WorkspaceService } from 'src/modules/workspace/workspace.service';


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

      const loginToken = await this.authService.generateLoginToken(
        email,
        workspace.id,
      );

      return user

    }
    catch (err) {
      throw new Error('workspace creation error');
    }
  }


  @Mutation(() => AuthResponse)
  async getAuthTokensFromLoginToken(
    @Args('loginToken') loginToken: string,
    // @OriginHeader() origin: string,
  ) {
    return this.authService.verifyToken(loginToken)
  }
}