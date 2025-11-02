import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';


@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {

  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}


// import { CanActivate, ExecutionContext } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// import { Observable } from 'rxjs';

// export class GqlAuthGuard implements CanActivate {
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const ctx = GqlExecutionContext.create(context);
//     const request = ctx.getContext().req;
//     return request.user !== undefined;
//   }
// }


// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

// import { AccessTokenService } from 'src/modules/auth/token/services/access-token.service';

// @Injectable()
// export class GqlAuthGuard implements CanActivate {
//   constructor(
//     private readonly accessTokenService: AccessTokenService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();

//     try {
//       const data =
//         await this.accessTokenService.validateTokenByRequest(request);
//       // const metadataVersion = data.workspace
//       //   ? await this.workspaceStorageCacheService.getMetadataVersion(
//       //       data.workspace.id,
//       //     )
//       //   : undefined;

//       // request.user = data.user;
//       // request.apiKey = data.apiKey;
//       // request.workspace = data.workspace;
//       // request.workspaceId = data.workspace?.id;
//       // request.workspaceMetadataVersion = metadataVersion;
//       // request.workspaceMemberId = data.workspaceMemberId;
//       // request.userWorkspaceId = data.userWorkspaceId;

//       request.user = data.user;
//       request.workspace = data.workspace;
//       request.workspaceMemberId = data.workspaceMemberId;
//       request.authProvider = data.authProvider;

//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
// }
