import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { addMilliseconds } from 'date-fns';
import ms from 'ms';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import {
  AppToken,
  AppTokenType,
} from 'src/modules/app-token/app-token.entity';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';
import { AuthToken } from 'src/modules/auth/dto/token.entity';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { User } from 'src/modules/user/user.entity';
import {
  RefreshTokenJwtPayload,
  JwtTokenTypeEnum,
} from 'src/modules/auth/types/auth-context.type';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly configService: ConfigService,
    @InjectRepository(AppToken, 'core')
    private readonly appTokenRepository: Repository<AppToken>,
    @InjectRepository(User, 'core')
    private readonly userRepository: Repository<User>,
  ) {}

  async verifyRefreshToken(refreshToken: string) {
    const coolDown = '1m';

    await this.jwtWrapperService.verifyJwtToken(
      refreshToken,
      JwtTokenTypeEnum.REFRESH,
    );
    const jwtPayload =
      this.jwtWrapperService.decode<RefreshTokenJwtPayload>(refreshToken);

    if (!(jwtPayload.jti && jwtPayload.sub)) {
      throw new AuthException(
        'This refresh token is malformed',
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    const token = await this.appTokenRepository.findOneBy({
      id: jwtPayload.jti,
    });

    if (!token) {
      throw new AuthException(
        "This refresh token doesn't exist",
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: jwtPayload.sub },
      relations: ['appTokens', 'workspaceMembers'],
    });

    if (!user) {
      throw new AuthException(
        'User not found',
        AuthExceptionCode.INVALID_INPUT,
      );
    }

    // Check if revokedAt is less than coolDown
    if (
      token.revokedAt &&
      token.revokedAt.getTime() <= Date.now() - ms(coolDown)
    ) {
      // Revoke all user refresh tokens
      await Promise.all(
        user.appTokens.map(async ({ id, type }) => {
          if (type === AppTokenType.RefreshToken) {
            await this.appTokenRepository.update(
              { id },
              {
                revokedAt: new Date(),
              },
            );
          }
        }),
      );

      throw new AuthException(
        'Suspicious activity detected, this refresh token has been revoked. All tokens have been revoked.',
        AuthExceptionCode.FORBIDDEN_EXCEPTION,
      );
    }

    return {
      user,
      token,
      authProvider: jwtPayload.authProvider,
      targetedTokenType: jwtPayload.targetedTokenType,
    };
  }

  async generateRefreshToken(
    payload: Omit<RefreshTokenJwtPayload, 'type' | 'sub' | 'jti'>,
  ): Promise<AuthToken> {
    const secret = this.jwtWrapperService.generateAppSecret(
      JwtTokenTypeEnum.REFRESH,
      payload.workspaceId ?? payload.userId,
    );
    const REFRESH_TOKEN_EXPIRES_IN = this.configService.get('REFRESH_TOKEN_EXPIRES_IN')
    const expiresIn = REFRESH_TOKEN_EXPIRES_IN !== undefined ? REFRESH_TOKEN_EXPIRES_IN : '60d';

    if (!expiresIn) {
      throw new AuthException(
        'Expiration time for access token is not set',
        AuthExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
    const expiresInMs = ms(expiresIn);

    if (typeof expiresInMs !== 'number') {
      throw new AuthException(
        `Invalid EXPIRES_IN value: ${expiresIn}`,
        AuthExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }
    const expiresAt = addMilliseconds(new Date().getTime(), expiresInMs);

    const refreshToken = this.appTokenRepository.create({
      ...payload,
      expiresAt,
      type: AppTokenType.RefreshToken,
    });

    await this.appTokenRepository.save(refreshToken);

    return {
      token: this.jwtWrapperService.sign(
        {
          ...payload,
          sub: payload.userId,
          type: JwtTokenTypeEnum.REFRESH,
        },
        {
          secret,
          expiresIn,
          jwtid: refreshToken.id,
        },
      ),
      expiresAt,
    };
  }
}
