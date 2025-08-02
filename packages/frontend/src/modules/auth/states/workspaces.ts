import { Workspace } from '@src/generated/graphql';
import { createState } from '@src/utils/createState';

export type Workspaces = Pick<
  Workspace,
  'id' | 'name' | 'role' | 'workspace'
>[];

  export const workspacesState = createState<Workspaces>({
  key: 'workspacesState',
  defaultValue: [],
});
