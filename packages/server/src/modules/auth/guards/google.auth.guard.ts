import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {

 async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    // let workspace: Workspace | null = null;
    console.log("...........................", request.query);
    try {
      // if (
      //   request.query.workspaceId &&
      //   typeof request.query.workspaceId === 'string'
      // ) {
      //   request.params.workspaceId = request.query.workspaceId;
      //   workspace = await this.workspaceRepository.findOneBy({
      //     id: request.query.workspaceId,
      //   });
      // }

      // if (request.query.error === 'access_denied') {
      //   throw new AuthException(
      //     'Google OAuth access denied',
      //     AuthExceptionCode.OAUTH_ACCESS_DENIED,
      //   );
      // }

      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      // this.guardRedirectService.dispatchErrorFromGuard(
      //   context,
      //   err,
      //   this.domainManagerService.getSubdomainAndCustomDomainFromWorkspaceFallbackOnDefaultSubdomain(
      //     workspace,
      //   ),
      // );

      return false;
    }
  }

}