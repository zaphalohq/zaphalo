// tenancy.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WorkspaceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const workspaceId = req.headers['x-workspace-id'];
    // if (!workspaceId) {
    //   return res.status(400).send('Worksace ID is missing');
    // }
    if (workspaceId) {
      req.workspaceId = workspaceId.toString();
    }
    next();
  }
}
