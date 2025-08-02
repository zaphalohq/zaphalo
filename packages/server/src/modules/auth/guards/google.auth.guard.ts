import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      return false;
    }
  }

}