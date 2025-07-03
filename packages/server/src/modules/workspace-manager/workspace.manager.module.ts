import { Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request as ExpressRequest } from 'express';
import { getWorkspaceConnection } from './workspace.manager.utils';

import { CONNECTION } from './workspace.manager.symbols';
import { workspaceConnectionSource } from 'src/database/typeorm/workspace/workspace.datasource';

/**
 * Note that because of Scope Hierarchy, all injectors of this
 * provider will be request-scoped by default. Hence there is
 * no need for example to specify that a consuming tenant-level
 * service is itself request-scoped.
 * https://docs.nestjs.com/fundamentals/injection-scopes#scope-hierarchy
 */
const connectionFactory = {
  provide: CONNECTION,
  scope: Scope.REQUEST,
  // useValue: workspaceConnectionSource,
  useFactory:(request: any) => {
    let { workspaceId } = request;
    if(!workspaceId){
      workspaceId = request?.req.headers['x-workspace-id']
    }
    console.log("...................workspaceId...............",workspaceId);
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
