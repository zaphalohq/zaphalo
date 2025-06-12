import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { WorkspaceService } from "../workspace/workspace.service";
import { Workspace } from "../workspace/workspace.entity";
import * as bcrypt from "bcrypt";
import { CreateUserDTO } from "../user/dto/create-user.dto";
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { AuthSsoService } from 'src/modules/auth/services/auth-sso.service';
import { SignInUpService } from 'src/modules/auth/services/sign-in-up.service';
import { WorkspaceAuthProvider } from 'src/modules/workspace/types/workspace.type';
import { error } from "console";
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "../user/user.entity";
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


@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
    private readonly domainManagerService: DomainManagerService,
    private readonly workspaceService: WorkspaceService,
    private readonly authSsoService: AuthSsoService,
    private readonly signInUpService: SignInUpService,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
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
    const users = await this.userservice.findByUserId(user.id)
    if(!users) throw error("this is error of")
      return {
        access_token: this.jwtService.sign(payload),
        workspaceIds: JSON.stringify(WorkspaceIds),
        userDetails : {
          firstName : users.firstName,
          lastName : users.lastName,
          email : users.email
        }
      };
    }

    async Register(register: CreateUserDTO): Promise<any> {
      // const username_validation = await this.userservice.findOneByUsername(register.username);
      const email_validation = await this.userservice.findOneByEmail(register.email);
      if (email_validation) {
        return "User already exists";
      }

    // Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(register.password || 'Vipul@123', saltRounds);

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
      userData.newUserPayload.passwordHash =
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

      return await this.signInUpService.signInUp({
        ...params,
        userData: {
          type: 'newUserWithPicture',
          newUserWithPicture: partialUserWithPicture,
        },
      });
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
      | { authProvider: Extract<WorkspaceAuthProvider, 'password'> }
    ),
  ) {

    if (params.workspaceInviteToken) {
      return (
        (await this.workspaceRepository.findOne({
          where: {
            inviteToken: params.workspaceInviteToken,
          },
          relations: ['approvedAccessDomains'],
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

      const expiresIn = '15m';

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

  async verifyToken(loginToken: string){


    const decodeToken = this.decode(loginToken, {
      json: true,
    });

    const payload = this.jwtService.verify(loginToken, {
      secret: this.generateAppSecret('LOGIN', decodeToken.workspaceId),
    });

    const users = await this.userservice.findOneByEmail(payload.sub)
    if(!users) throw error("this is error of users")
    const payloadfinal = {
      firstName: users.firstName,
      lastName: users.lastName,
      sub: users.id,
      email: users.email,
      workspaceId: payload.workspaceId,
      workspaceIds: payload.workspaceId
    };

    const expiresIn = '15m';
    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));
    console.log("...................res................", users);

    const res = {
        accessToken : {
          token : this.jwtService.sign(payloadfinal),
          expiresAt
        },
        workspaceIds: JSON.stringify(payload.workspaceId),
        userDetails: {
          firstName: users.firstName,
          lastName: users.lastName,
          email : users.email
        }
      };

    console.log("...................res................", res);

    return {
        access_token: this.jwtService.sign(payloadfinal),
        accessToken : {
          token : this.jwtService.sign(payloadfinal),
          expiresAt
        },
        workspaceIds: JSON.stringify(payload.workspaceId),
        userDetails: {
          firstName: users.firstName,
          lastName: users.lastName,
          email : users.email
        }
      };
  }

}