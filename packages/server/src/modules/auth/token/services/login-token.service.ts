import { Injectable } from '@nestjs/common';

import { addMilliseconds } from 'date-fns';
import ms from 'ms';

import { AuthToken } from 'src/modules/auth/dto/token.entity';
import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { ConfigService } from '@nestjs/config';
import {
  LoginTokenJwtPayload,
  JwtTokenTypeEnum,
} from 'src/modules/auth/types/auth-context.type';
import { AuthProviderEnum } from 'src/modules/workspace/types/workspace.type';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';

@Injectable()
export class LoginTokenService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly configService: ConfigService,
  ) {}

  async generateLoginToken(
    email: string,
    workspaceId: string,
    authProvider?: AuthProviderEnum,
  ): Promise<AuthToken> {
    const jwtPayload: LoginTokenJwtPayload = {
      type: JwtTokenTypeEnum.LOGIN,
      sub: email,
      workspaceId,
      authProvider,
    };

    const secret = this.jwtWrapperService.generateAppSecret(
      jwtPayload.type,
      workspaceId,
    );

    const LOGIN_TOKEN_EXPIRES_IN = this.configService.get('LOGIN_TOKEN_EXPIRES_IN')
    const expiresIn = LOGIN_TOKEN_EXPIRES_IN !== undefined ? LOGIN_TOKEN_EXPIRES_IN : '15m';

    const expiresInMs = ms(expiresIn);

    if (typeof expiresInMs !== 'number') {
      throw new AuthException(
        `Invalid EXPIRES_IN value: ${expiresIn}`,
        AuthExceptionCode.INTERNAL_SERVER_ERROR,
      );
    }

    const expiresAt = addMilliseconds(new Date().getTime(), expiresInMs);

    return {
      token: this.jwtWrapperService.sign(jwtPayload, {
        secret,
        expiresIn,
      }),
      expiresAt,
    };
  }

  async verifyLoginToken(loginToken: string): Promise<{
    sub: string;
    workspaceId: string;
    authProvider: AuthProviderEnum;
  }> {
    await this.jwtWrapperService.verifyJwtToken(
      loginToken,
      JwtTokenTypeEnum.LOGIN,
    );

    return this.jwtWrapperService.decode(loginToken, {
      json: true,
    });
  }
}
