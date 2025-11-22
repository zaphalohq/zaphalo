import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { isDefined } from 'src/utils/isDefined';

import { AppToken } from 'src/modules/app-token/app-token.entity';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';
import { AuthToken } from 'src/modules/auth/dto/token.entity';
import { AccessTokenService } from 'src/modules/auth/token/services/access-token.service';
import { RefreshTokenService } from 'src/modules/auth/token/services/refresh-token.service';
import { JwtTokenTypeEnum } from 'src/modules/auth/types/auth-context.type';

@Injectable()
export class WorkspaceTokenService {
  constructor(
    @InjectRepository(AppToken, 'core')
    private readonly appTokenRepository: Repository<AppToken>,
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async generateTokensFromRefreshToken(token: string, newWorkspaceId: string): Promise<{
    accessToken: AuthToken;
    refreshToken: AuthToken;
  }> {
    if (!token) {
      throw new AuthException(
        'Refresh token not found',
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    const {
      user,
      token: { id, workspaceId },
      authProvider,
      targetedTokenType: targetedTokenTypeFromPayload,
    } = await this.refreshTokenService.verifyRefreshToken(token);

    // Revoke old refresh token
    await this.appTokenRepository.update(
      {
        id,
      },
      {
        revokedAt: new Date(),
      },
    );

    // Support legacy token when targetedTokenType is undefined.
    const targetedTokenType =
      targetedTokenTypeFromPayload ?? JwtTokenTypeEnum.ACCESS;

    const accessToken = await this.accessTokenService.generateAccessToken({
      userId: user.id,
      workspaceId: newWorkspaceId,
      authProvider,
    });

    const refreshToken = await this.refreshTokenService.generateRefreshToken({
      userId: user.id,
      workspaceId: newWorkspaceId,
      authProvider,
      targetedTokenType,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
