import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/modules/auth/auth.exception';
import { GoogleStrategy } from 'src/modules/auth/strategies/google-auth.strategy';
// import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';

@Injectable()
export class GoogleAuthEnabledGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}


  canActivate(context: ExecutionContext): boolean {
    try {
      if (this.configService.get('GOOGLE_AUTH_ENABLED') == 'false') {
        throw new AuthException(
          'Google auth is not enabled',
          AuthExceptionCode.GOOGLE_API_AUTH_DISABLED,
        );
      }

      new GoogleStrategy(this.configService);

      return true;
    } catch (err) {
      return err
    }
  }
}
