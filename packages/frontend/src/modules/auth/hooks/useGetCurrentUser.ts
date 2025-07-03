import { useCallback } from 'react';
import {
  useGetCurrentUserLazyQuery,
} from 'src/generated/graphql';
import { currentUserState } from '../states/currentUserState';
import { currentUserWorkspaceState } from '../states/currentUserWorkspaceState';
import { workspacesState } from '../states/workspaces';
import { isDefined } from 'src/utils/validation/isDefined';
import { useSetRecoilState } from 'recoil';
import { currentWorkspaceIdState } from '../states/currentWorkspaceIdState';


export const useGetCurrentUser = () => {
  const [getCurrentUser] = useGetCurrentUserLazyQuery();
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setCurrentUserWorkspace = useSetRecoilState(currentUserWorkspaceState);
  const setCurrentWorkspaceId = useSetRecoilState(currentWorkspaceIdState)
  const setWorkspaces = useSetRecoilState(workspacesState);
  const loadCurrentUser = useCallback(async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });

    const user = currentUserResult.data?.currentUser;
console.log(currentUserResult,'currentUserResult...............................................');

    if (!user) throw Error("user not found")
    setCurrentUser(user);

    // const currentUserWorkspace =  user?.currentUserWorkspace
    // if(!currentUserWorkspace) throw Error('currentUserWorkspace doesnt exist in useAuth')
    if (isDefined(user?.currentWorkspace)) {
      setCurrentUserWorkspace(user?.currentWorkspace);
      // const path = window.location.pathname;
      // const segments : string[] = path.split('/');
      // if (segments.length > 2 && segments[1] === 'w') {
        // setCurrentWorkspaceId(segments[2] ?? null)
      // } else {
        // setCurrentWorkspaceId(user?.currentWorkspace?.id)
      // }
    }

    if (isDefined(user.workspaces)) {
      const validWorkspaces = user.workspaces
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