import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { AuthProviderEnum } from 'src/modules/workspace/types/workspace.type';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
    workspace?: Workspace;
    workspaceId?: string;
    workspaceMemberId?: string;
    authProvider?: AuthProviderEnum | null;
  }
}