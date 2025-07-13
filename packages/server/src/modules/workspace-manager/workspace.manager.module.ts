import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { CONNECTION } from './workspace.manager.symbols';
import { getWorkspaceConnection } from './workspace.manager.utils';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory:(request: any) => {
    let { workspaceId } = request;
     const isGraphQL = request?.hasOwnProperty('req') && request?.req?.body?.hasOwnProperty('operationName');

    if (isGraphQL) {
      workspaceId = request?.req?.headers['x-workspace-id'];
    } else {
      workspaceId = request.headers['x-workspace-id'];
    }

    if (workspaceId) {
      return getWorkspaceConnection(workspaceId);
    }
    return null;
  },
  inject: [REQUEST],
};

@Global()
@Module({
  providers: [connectionFactory],
  exports: [CONNECTION],
})
export class WorkspaceManagerModule {}
