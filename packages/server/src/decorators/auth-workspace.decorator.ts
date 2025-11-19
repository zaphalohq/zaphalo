import {
  ExecutionContext,
  createParamDecorator,
  InternalServerErrorException
} from '@nestjs/common';

import { getRequest } from 'src/utils/extract-request';
import { Workspace } from 'src/modules/workspace/workspace.entity';

export const AuthWorkspace = createParamDecorator(
  (options:  string | undefined, ctx: ExecutionContext) => {
    const request = getRequest(ctx);
    if (!request.workspace) {
      throw new InternalServerErrorException(
        "You're not authorized to do this. This should not ever happen.",
      );
    }
    return options === 'id' ? request.workspace.id : request.workspace;
  },
);
