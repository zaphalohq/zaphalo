import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { addMilliseconds } from 'date-fns';
import { Request } from 'express';
import ms from 'ms';
import { isWorkspaceActiveOrSuspended } from 'src/modules/workspace/utils/isWorkspaceActiveOrSuspended';
import { Repository } from 'typeorm';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';
import { AuthToken } from 'src/modules/auth/dto/token.entity';
import { JwtAuthStrategy } from 'src/modules/auth/strategies/jwt.auth.strategy';
import {
  AccessTokenJwtPayload,
  AuthContext,
  JwtTokenTypeEnum,
} from 'src/modules/auth/types/auth-context.type';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';
// import { userWorkspaceValidator } from 'src/modules/workspace/workspace-member.validate';
import { User } from 'src/modules/user/user.entity';
import { userValidator } from 'src/modules/user/user.validate';
import { Workspace } from 'src/modules/workspace/workspace.entity';
// import { workspaceValidator } from 'src/modules/workspace/workspace.validate';
// import { WorkspaceMemberWorkspaceEntity } from 'src/modules/workspace/standard-objects/workspace-member.workspace-entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly jwtStrategy: JwtAuthStrategy,
    private readonly configService: ConfigService,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Workspace, 'core')
    private readonly workspaceRepository: Repository<Workspace>,
    @InjectRepository(WorkspaceMember, 'core')
    private readonly workspaceMemberRepository: Repository<WorkspaceMember>,
  ) {}

  async generateAccessToken({
    userId,
    workspaceId,
    authProvider,
  }: Omit<
    AccessTokenJwtPayload,
    'type' | 'workspaceMemberId' | 'userWorkspaceId' | 'sub'
  >): Promise<AuthToken> {
    const ACCESS_TOKEN_EXPIRES_IN = this.configService.get('ACCESS_TOKEN_EXPIRES_IN')
    const expiresIn = ACCESS_TOKEN_EXPIRES_IN !== undefined ? ACCESS_TOKEN_EXPIRES_IN : '1m';

    const expiresInMs = ms(expiresIn);

    if (typeof expiresInMs !== 'number') {
      throw new AuthException(
        `Invalid EXPIRES_IN value: ${expiresIn}`,
        AuthExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }

    const expiresAt = addMilliseconds(new Date().getTime(), expiresInMs);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user){
      throw new Error("user not have workspace")
    }
    userValidator.assertIsDefinedOrThrow(
      user,
      new AuthException('User is not found', AuthExceptionCode.INVALID_INPUT),
    );

    let tokenWorkspaceMemberId: string | undefined;

    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });

    // workspaceValidator.assertIsDefinedOrThrow(workspace);

    if (isWorkspaceActiveOrSuspended(workspace)) {
      // const workspaceMemberRepository =
      //   await this.oRMGlobalManager.getRepositoryForWorkspace<WorkspaceMemberWorkspaceEntity>(
      //     workspaceId,
      //     'workspaceMember',
      //   );

      // const workspaceMember = await workspaceMemberRepository.findOne({
      //   where: {
      //     userId: user.id,
      //   },
      // });

      // if (!workspaceMember) {
      //   throw new AuthException(
      //     'User is not a member of the workspace',
      //     AuthExceptionCode.FORBIDDEN_EXCEPTION,
      //   );
      // }

      // tokenWorkspaceMemberId = workspaceMember.id;
    }
    const workspaceMember = await this.workspaceMemberRepository.findOne({
      where: {
        userId: user.id,
        workspaceId,
      },
    });
    if (!workspaceMember){
      throw new Error("user not have workspace")
    }
    // userWorkspaceValidator.assertIsDefinedOrThrow(userWorkspaceValidator);

    const jwtPayload: AccessTokenJwtPayload = {
      sub: user.id,
      userId: user.id,
      workspaceId,
      // workspaceMemberId: tokenWorkspaceMemberId,
      workspaceMemberId: workspaceMember.id,
      type: JwtTokenTypeEnum.ACCESS,
      authProvider,
    };

    return {
      token: this.jwtWrapperService.sign(jwtPayload, {
        secret: this.jwtWrapperService.generateAppSecret(
          JwtTokenTypeEnum.ACCESS,
          workspaceId,
        ),
        expiresIn,
      }),
      expiresAt,
    };
  }

  async validateToken(token: string): Promise<AuthContext> {
    await this.jwtWrapperService.verifyJwtToken(token, JwtTokenTypeEnum.ACCESS);

    const decoded = this.jwtWrapperService.decode<AccessTokenJwtPayload>(token);
    const {
      user,
      // apiKey,
      workspace,
      workspaceMemberId,
      // userWorkspace,
      // userWorkspaceId,
      authProvider,
    } = await this.jwtStrategy.validate(decoded);

    return {
      user,
      // apiKey,
      workspace,
      // userWorkspace,
      workspaceMemberId,
      // userWorkspaceId,
      authProvider,
    };
  }

  async validateTokenByRequest(request: Request): Promise<AuthContext> {
    const token = this.jwtWrapperService.extractJwtFromRequest()(request);

    if (!token) {
      throw new AuthException(
        'Missing authentication token',
        AuthExceptionCode.FORBIDDEN_EXCEPTION,
      );
    }
    const payload = await this.validateToken(token)
    return this.validateToken(token);
  }
}
