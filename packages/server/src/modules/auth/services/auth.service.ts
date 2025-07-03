import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { error } from "console";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { addMilliseconds } from 'date-fns';
import { createHash } from 'crypto';
import ms from 'ms';
import * as jwt from 'jsonwebtoken';
import {
  AuthProviderWithPasswordType,
  ExistingUserOrNewUser,
  SignInUpBaseParams,
  SignInUpNewUserPayload,
} from 'src/modules/auth/types/signInUp.type';
import { EmailService } from 'src/modules/email/email.service';
import { UserService } from "src/modules/user/user.service";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { Workspace } from "src/modules/workspace/workspace.entity";
import { WorkspaceInvitation } from "src/modules/workspace/workspaceInvitation.entity";
import { CreateUserDTO } from "src/modules/user/dto/create-user.dto";
import { User } from "src/modules/user/user.entity";
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { AuthSsoService } from 'src/modules/auth/services/auth-sso.service';
import { SignInUpService } from 'src/modules/auth/services/sign-in-up.service';
import { WorkspaceAuthProvider } from 'src/modules/workspace/types/workspace.type';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private readonly domainManagerService: DomainManagerService,
    private readonly workspaceService: WorkspaceService,
    private readonly authSsoService: AuthSsoService,
    private readonly signInUpService: SignInUpService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceInvitationRepository: Repository<WorkspaceInvitation>,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByEmail(email);
    console.log("................user..................", user);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async checkUserForSigninUp(username: string) {
    const user = this.userservice.findOneByEmail(username);
    return user;
  }

  async login(user: any, inviteToken?: string) {
    const workspaces = await this.workspaceService.getOrCreateWorkspaceForUser(user.id);
    const WorkspaceIds = workspaces.map(workspace => workspace.id);
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      sub: user.id,
      workspaceIds: WorkspaceIds,
      role: user.role
    };
    const users = await this.userservice.findOneUserWithWorkspaces(user.id)
    if (!users) throw error("users not found")

    // const currentWorkspace = users.workspaces.find(
    //   (userWorkspace) => userWorkspace.id === users.id,
    // );


    // if(!currentWorkspace) throw Error("current Workspace not found")
    const loginToken = await this.generateLoginToken(
      user.email,
      workspaces[0].id
    );

    if (inviteToken) {
      const userId = await user.id
      const workspace = await this.workspaceService.getOrCreateWorkspaceForUser(userId, inviteToken)
      console.log(workspace,'getOrCreateWorkspaceForUsergetOrCreateWorkspaceForUsergetOrCreateWorkspaceForUser');
      
      
    }

    return {
      access_token: this.jwtService.sign(payload),
      workspaceIds: JSON.stringify(WorkspaceIds),
      id: users.id,
      email: users.email,
      accessToken: {
        token: loginToken.token,
        expiresAt: loginToken.expiresAt
      },
      userDetails: {
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      },
      workspaces: users.workspaces,
    };
  }

  async Register(register: CreateUserDTO): Promise<any> {
    // const username_validation = await this.userservice.findOneByUsername(register.username);
    const email_validation = await this.userservice.findOneByEmail(register.email);
    if (email_validation) {
      return "email already exists";
    }

    // Hash the password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(register.password, saltRounds);

    // Update the register object with the hashed password
    const userData = { ...register, password: hashedPassword, username: register.email };

    const user = await this.userservice.createUser(userData);

    
    return user;
  }



  computeRedirectURI({
    loginToken,
    // workspace,
  }: {
    loginToken: string;
  }) {
    const url = this.domainManagerService.buildWorkspaceURL({
      // workspace,
      pathname: '/verify',
      searchParams: {
        loginToken,
      },
    });

    return url.toString();
  }

  formatUserDataPayload(
    newUserPayload: SignInUpNewUserPayload,
    existingUser?: User | null,
  ): ExistingUserOrNewUser {
    return {
      userData: existingUser
        ? { type: 'existingUser', existingUser }
        : {
          type: 'newUser',
          newUserPayload,
        },
    };
  }


  private async validatePassword(
    userData: ExistingUserOrNewUser['userData'],
    authParams: Extract<
      AuthProviderWithPasswordType['authParams'],
      { provider: 'password' }
    >,
  ) {
    if (userData.type === 'newUser') {
      userData.newUserPayload.password =
        await this.signInUpService.generateHash(authParams.password);
    }

    if (userData.type === 'existingUser') {
      await this.signInUpService.validatePassword({
        password: authParams.password,
        passwordHash: userData.existingUser.password,
      });
    }
  }

  private async isAuthProviderEnabledOrThrow(
    userData: ExistingUserOrNewUser['userData'],
    authParams: AuthProviderWithPasswordType['authParams'],
    workspace: Workspace | undefined | null,
  ) {
    if (authParams.provider === 'password') {
      await this.validatePassword(userData, authParams);
    }

    // if (isDefined(workspace)) {
    //   workspaceValidator.isAuthEnabledOrThrow(authParams.provider, workspace);
    // }
  }

  async signInUp(
    params: SignInUpBaseParams &
      ExistingUserOrNewUser &
      AuthProviderWithPasswordType,
  ) {
    await this.isAuthProviderEnabledOrThrow(
      params.userData,
      params.authParams,
      params.workspace,
    );

    if (params.userData.type === 'newUser') {
      const partialUserWithPicture =
        await this.signInUpService.computeParamsForNewUser(
          params.userData.newUserPayload,
          params.authParams,
        );

      const { user, workspace } = await this.signInUpService.signInUp({
        ...params,
        userData: {
          type: 'newUserWithPicture',
          newUserWithPicture: partialUserWithPicture,
        },
      });
      // this.emailService.sendUserWelcome(user, '123');
      // console.log("......................login....from backend");
      
      return { user, workspace }
    }

    return await this.signInUpService.signInUp({
      ...params,
      userData: {
        type: 'existingUser',
        existingUser: params.userData.existingUser,
      },
    });
  }

  async findWorkspaceForSignInUp(
    params: {
      workspaceId?: string;
      workspaceInviteToken?: string;
    } & (
        | {
          authProvider: Exclude<WorkspaceAuthProvider, 'password'>;
          email: string;
        }
        | {
          authProvider: Extract<WorkspaceAuthProvider, 'password'>;
          email?: string;
        }
      ),
  ) {

    if (params.workspaceInviteToken) {
      return (
        (await this.workspaceRepository.findOne({
          where: {
            inviteToken: params.workspaceInviteToken,
          },
          // relations: ['approvedAccessDomains'],
        })) ?? undefined
      );
    }

    if (params.authProvider !== 'password') {

      return (
        (await this.authSsoService.findWorkspaceFromWorkspaceIdOrAuthProvider(
          {
            email: params.email,
            authProvider: params.authProvider,
          },
          params.workspaceId,
        )) ?? undefined
      );
    }

    const workspace = params.workspaceId
      ? await this.workspaceRepository.findOne({
        where: {
          id: params.workspaceId,
        },
        // relations: ['approvedAccessDomains'],
      })
      : undefined;

    return params.workspaceId
      ? await this.workspaceRepository.findOne({
        where: {
          id: params.workspaceId,
        },
        // relations: ['approvedAccessDomains'],
      })
      : undefined;
  }

  async findSignInUpInvitation(params: { currentWorkspace: Workspace, email: string }) {

    // Need To implements for invitation accepted

  }

  generateAppSecret(type: string, workspaceId?: string): string {
    const appSecret = process.env.APP_SECRET;
    if (!appSecret) {
      throw new Error('APP_SECRET is not set');
    }

    return createHash('sha256')
      .update(`${appSecret}${workspaceId}${type}`)
      .digest('hex');
  }


  async generateLoginToken(
    email: string,
    workspaceId: string,
  ) {

    const secret = this.generateAppSecret(
      'LOGIN',
      workspaceId,
    );

    const expiresIn = '7d';

    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));
    const jwtPayload = {
      sub: email,
      workspaceId,
    };


    const token = {
      token: this.jwtService.sign(jwtPayload, {
        secret,
        expiresIn,
      }),
      expiresAt,
    };

    return token;
  }
  decode<T = any>(payload: string, options?: jwt.DecodeOptions): T {
    return this.jwtService.decode(payload, options);
  }

  async verifyToken(loginToken: string) {
    const decodeToken = this.decode(loginToken, {
      json: true,
    });

    const payload = this.jwtService.verify(loginToken, {
      secret: this.generateAppSecret('LOGIN', decodeToken.workspaceId),
    });

    const user = await this.userservice.findOneByEmail(payload.sub)
    if (!user) throw error("this is error of users")
    const payloadfinal = {
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
      email: user.email,
      workspaceId: payload.workspaceId,
      workspaceIds: payload.workspaceId
    };

    const expiresIn = '7d';
    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));

    const res = {
      accessToken: {
        token: this.jwtService.sign(payloadfinal),
        expiresAt
      },
      workspaceIds: JSON.stringify(payload.workspaceId),
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    };

    return {
      access_token: this.jwtService.sign(payloadfinal),
      accessToken: {
        token: this.jwtService.sign(payloadfinal),
        expiresAt
      },
      workspaceIds: JSON.stringify(payload.workspaceId),
      userDetails: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    };
  }

}