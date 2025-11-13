import { ApolloClient } from '@apollo/client';

import { currentUserWorkspaceState } from '@src/models/auth/states/currentUserWorkspaceState';

export interface ApolloManager<TCacheShape> {
  getClient(): ApolloClient<TCacheShape>;
  currentUserWorkspaceState(workspaceMember: CurrentWorkspaceMember | null): void;
}
