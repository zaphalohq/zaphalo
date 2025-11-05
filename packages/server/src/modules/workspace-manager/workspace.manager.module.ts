import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { CONNECTION } from './workspace.manager.symbols';
import { getWorkspaceConnection } from './workspace.manager.utils';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: any) => {
    let { workspace } = request;
    const isGraphQL = request?.hasOwnProperty('req') && request?.req?.body?.hasOwnProperty('operationName');
    if (isGraphQL) {
      workspace = request?.req?.workspace
    } 
    // if (isGraphQL && workspace) {
    //   workspaceId = request?.req?.headers['x-workspace-id'] || request?.req?.workspaceId;
    // }
    // else {
    //     if (request?.headers && request?.headers['x-workspace-id']) {
    //       workspaceId = request.headers['x-workspace-id'];
    //     } else {
    //       workspaceId = request?.params?.workspace || request?.req?.workspaceId;
    //     }
    //   }
    // }

    if (workspace) {
      return getWorkspaceConnection(workspace.id);
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
export class WorkspaceManagerModule { }
