import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';

export enum JwtTokenTypeEnum {
  ACCESS = 'ACCESS',
  REFRESH = 'REFRESH',
  WORKSPACE_AGNOSTIC = 'WORKSPACE_AGNOSTIC',
  LOGIN = 'LOGIN',
  FILE = 'FILE',
  API_KEY = 'API_KEY',
  POSTGRES_PROXY = 'POSTGRES_PROXY',
  REMOTE_SERVER = 'REMOTE_SERVER',
}

type CommonPropertiesJwtPayload = {
  sub: string;
};

export type FileTokenJwtPayload = CommonPropertiesJwtPayload & {
  type: JwtTokenTypeEnum.FILE;
  workspaceId: string;
  filename: string;
  workspaceMemberId?: string;
  noteBlockId?: string;
  attachmentId?: string;
  personId?: string;
};

export type AccessTokenJwtPayload = CommonPropertiesJwtPayload & {
  type: JwtTokenTypeEnum.ACCESS;
  workspaceId: string;
  userId: string;
};

export type AuthContext = {
  user?: User | null | undefined;
  workspace?: Workspace;
  userWorkspaceId?: string;
};
