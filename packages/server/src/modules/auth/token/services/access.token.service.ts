import { Injectable } from '@nestjs/common';

import { JwtWrapperService } from 'src/modules/jwt/jwt-wrapper.service';
import { JwtAuthStrategy } from 'src/modules/auth/strategies/jwt.auth.strategy';
import { AuthContext, JwtTokenTypeEnum, AccessTokenJwtPayload } from 'src/modules/auth/types/auth-context.type';

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtWrapperService: JwtWrapperService,
    private readonly jwtStrategy: JwtAuthStrategy,
  ){}

  async validateToken(token: string): Promise<AuthContext> {
    await this.jwtWrapperService.verifyWorkspaceToken(token, JwtTokenTypeEnum.ACCESS);

    const decoded = this.jwtWrapperService.decode<AccessTokenJwtPayload>(token);

    const {
      user,
      // apiKey,
      workspace,
      // workspaceMemberId,
      // userWorkspace,
      userWorkspaceId,
      // authProvider,
    } = await this.jwtStrategy.validate(decoded);

    return {
      user,
      // apiKey,
      workspace,
      // userWorkspace,
      // workspaceMemberId,
      userWorkspaceId,
      // authProvider,
    };
  }

  async validateTokenByRequest(request: Request): Promise<AuthContext> {
    const token = this.jwtWrapperService.extractJwtFromRequest()(request);

    if (!token) {
      throw new Error('Missing authentication token');
      // throw new AuthException(
      //   'Missing authentication token',
      //   AuthExceptionCode.FORBIDDEN_EXCEPTION,
      // );
    }

    return this.validateToken(token);
  }

}