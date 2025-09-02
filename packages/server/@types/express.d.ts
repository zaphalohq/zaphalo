import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
    workspace?: Workspace;
    workspaceId?: string;
  }
}

// declare namespace Express {
//   export interface Request {
//     user?: User | null;
//     workspaceId?: string;
//   }
// }