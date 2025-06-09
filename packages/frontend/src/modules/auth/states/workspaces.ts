import { Workspace } from 'src/generated/graphql';
import { createState } from 'src/utils/createState';

export type Workspaces = Pick<
  Workspace,
  'id' | 'logo' | 'displayName' | 'workspaceUrls'
>[];

export const workspacesState = createState<Workspaces>({
  key: 'workspacesState',
  defaultValue: [],
});
