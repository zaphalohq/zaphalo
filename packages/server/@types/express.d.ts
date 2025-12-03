import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { AuthProviderEnum } from 'src/modules/workspace/types/workspace.type';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User | null;
    workspace?: Workspace;
    workspaceId?: string;
    workspaceMemberId?: string;
    authProvider?: AuthProviderEnum | null;
    userWorkspace?: WorkspaceMember
  }
}