import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getRequest } from 'src/utils/extract-request';

export const AuthWorkspace = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = getRequest(ctx);
    const user = request.user
    const workspaceId = request.workspace.id;
    const currentUserWorkspace = user.workspaceMembers.find(
      (userWorkspace) => userWorkspace.workspace.id === workspaceId,
    );
    const workspace = currentUserWorkspace ? currentUserWorkspace.workspace : user.workspaceMembers[0].workspace;
    return workspace;
  },
);
