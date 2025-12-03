import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';
import { AuthProviderEnum } from 'src/modules/workspace/types/workspace.type';
import { WorkspaceMember } from 'src/modules/workspace/workspaceMember.entity';

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

export type LoginTokenJwtPayload = CommonPropertiesJwtPayload & {
  type: JwtTokenTypeEnum.LOGIN;
  workspaceId: string;
  authProvider?: AuthProviderEnum;
};

export type RefreshTokenJwtPayload = CommonPropertiesJwtPayload & {
  type: JwtTokenTypeEnum.REFRESH;
  workspaceId?: string;
  userId: string;
  jti?: string;
  authProvider?: AuthProviderEnum;
  targetedTokenType: JwtTokenTypeEnum;
};

export type AccessTokenJwtPayload = CommonPropertiesJwtPayload & {
  type: JwtTokenTypeEnum.ACCESS;
  workspaceId: string;
  workspaceMemberId?: string;
  // userWorkspaceId: string;
  userId: string;
  authProvider?: AuthProviderEnum;
};

export type AuthContext = {
  user?: User | null | undefined;
  workspaceMemberId?: string;
  workspace?: Workspace;
  authProvider?: AuthProviderEnum;
  userWorkspace?: WorkspaceMember
};