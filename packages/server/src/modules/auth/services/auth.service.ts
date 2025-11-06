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
import { User } from "src/modules/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { EmailService } from 'src/modules/email/email.service';
import { Workspace } from "src/modules/workspace/workspace.entity";
import { CreateUserDTO } from "src/modules/user/dto/create-user.dto";
import { WorkspaceService } from "src/modules/workspace/workspace.service";
import { AuthSsoService } from 'src/modules/auth/services/auth-sso.service';
import { SignInUpService } from 'src/modules/auth/services/sign-in-up.service';
import { WorkspaceAuthProvider, AuthProviderEnum } from 'src/modules/workspace/types/workspace.type';
import { WorkspaceInvitation } from "src/modules/workspace/workspaceInvitation.entity";
import { DomainManagerService } from 'src/modules/domain-manager/services/domain-manager.service';
import { LoginTokenService } from 'src/modules/auth/token/services/login-token.service';
import { AccessTokenService } from 'src/modules/auth/token/services/access-token.service';
import { RefreshTokenService } from 'src/modules/auth/token/services/refresh-token.service';
import {
  PASSWORD_REGEX,
  compareHash,
  hashPassword,
} from 'src/modules/auth/auth.util';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';
import { userValidator } from 'src/modules/user/user.validate';
import {
  RefreshTokenJwtPayload,
  JwtTokenTypeEnum,
} from 'src/modules/auth/types/auth-context.type';

@Injectable()
export class AuthService {
  constructor(
    private userservice: UserService,
    private jwtService: JwtService,
    private readonly domainManagerService: DomainManagerService,
    private readonly workspaceService: WorkspaceService,
    private readonly authSsoService: AuthSsoService,
    private readonly signInUpService: SignInUpService,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    private readonly loginTokenService: LoginTokenService,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) { }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userservice.findOneByEmail(email);
    if (user && await compareHash(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  computeRedirectURI({
    loginToken,
  }: {
    loginToken: string;
  }) {
    const url = this.domainManagerService.buildWorkspaceURL({
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
      })
      : undefined;

    return params.workspaceId
      ? await this.workspaceRepository.findOne({
        where: {
          id: params.workspaceId,
        },
      })
      : undefined;
  }

  async findSignInUpInvitation(params: { currentWorkspace: Workspace, email: string }) {
  }

  async verify(email: string, workspaceId: string, authProvider: AuthProviderEnum) {
    if (!email) {
      throw new AuthException(
        'Email is required',
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    const user = await this.userRepository.findOne({
      where: { email },
    });

    userValidator.assertIsDefinedOrThrow(
      user,
      new AuthException('User not found', AuthExceptionCode.USER_NOT_FOUND),
    );

    user.password = '';

    const accessToken = await this.accessTokenService.generateAccessToken({
      userId: user.id,
      workspaceId,
      authProvider,
    });
    const refreshToken = await this.refreshTokenService.generateRefreshToken({
      userId: user.id,
      workspaceId,
      authProvider,
      targetedTokenType: JwtTokenTypeEnum.ACCESS,
    });

    return {
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

}