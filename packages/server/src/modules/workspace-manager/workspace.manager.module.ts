import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import { CONNECTION } from './workspace.manager.symbols';
import { getWorkspaceConnection } from './workspace.manager.utils';

const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  useFactory: (request: any) => {
    let workspace;
    if(request?.hasOwnProperty('req')){
       workspace = request.req?.workspaceId;
    }else{
      workspace = request.workspaceId
    }
    if (workspace) {
      return getWorkspaceConnection(workspace);
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
