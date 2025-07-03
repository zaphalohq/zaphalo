// tenancy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WorkspaceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(".......req.headers['x-workspace-id']...................", req.headers['x-workspace-id']);
    const workspaceId = req.headers['x-workspace-id'] ;
    // || '7144aaa8-82b6-4886-bbbc-bcc01df850ed'
    // if (!workspaceId) {
    //   return res.status(400).send('Worksace ID is missing');
    // }
    if (workspaceId) {
      // req.workspaceId = workspaceId.toString();
    }
    next();
  }
}
