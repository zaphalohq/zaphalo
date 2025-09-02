import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { getRequest } from 'src/utils/extract-request';

import { Observable } from 'rxjs';

@Injectable()
export class WorkspaceAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {


    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req.user;

    return request.workspaceId !== undefined;
  }
}
