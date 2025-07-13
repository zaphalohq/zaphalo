import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getRequest } from 'src/utils/extract-request';

export const AuthWorkspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getRequest(ctx);

    const user = request.user
    const workspaceId = request.headers['x-workspace-id'];
    const currentUserWorkspace = user.user.workspaces.find(
      (userWorkspace) => userWorkspace.workspace.id === workspaceId,
    );
    return currentUserWorkspace ? currentUserWorkspace.workspace : user.user.workspaces[0].workspace;
  },
);
