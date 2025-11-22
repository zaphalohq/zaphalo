import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  useGetCurrentUserLazyQuery,
} from '@src/generated/graphql';
import { isDefined } from '@src/utils/validation/isDefined';
import { workspacesState } from '@src/modules/auth/states/workspaces';
import { currentUserState } from '@src/modules/auth/states/currentUserState';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';

export const useGetCurrentUser = () => {
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setCurrentUserWorkspace = useSetRecoilState(currentUserWorkspaceState);
  const setWorkspaces = useSetRecoilState(workspacesState);
  const loadCurrentUser = useCallback(async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });
    const user = currentUserResult.data?.currentUser;
    if (!user) throw Error("user not found")
    setCurrentUser(user);
    if (isDefined(user?.currentWorkspace)) {
      setCurrentUserWorkspace(user?.currentWorkspace);
    }
    if (isDefined(user.workspaceMembers)) {
      const validWorkspaces = user.workspaceMembers
        .filter(
          ({ workspace }) => workspace !== null && workspace !== undefined,
        )
        .map((validWorkspace) => validWorkspace.workspace)
        .filter(isDefined);
      setWorkspaces(validWorkspaces);
    }

  }, []);

  return {
    getCurrentUser: loadCurrentUser
  };
}