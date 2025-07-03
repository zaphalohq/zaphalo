import { useCallback } from 'react';
import { VITE_BACKEND_URL } from '@src/config';
import { ApolloError, useApolloClient } from '@apollo/client';
import { useRedirect } from '@src/modules/domain-manager/hooks/useRedirect';
import {
  useGetAuthTokensFromLoginTokenMutation,
  useGetCurrentUserLazyQuery,
} from 'src/generated/graphql';
import { useNavigate } from 'react-router-dom';
import { setItem } from 'src/components/utils/localStorage';
import { tokenPairState } from '../states/tokenPairState';
import { currentUserState } from '../states/currentUserState';
import { currentUserWorkspaceState } from '../states/currentUserWorkspaceState';
import { workspacesState } from '../states/workspaces';

import { cookieStorage } from 'src/utils/cookie-storage';
import { isDefined } from 'src/utils/validation/isDefined';
import {
  snapshot_UNSTABLE,
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { currentWorkspaceIdState } from '../states/currentWorkspaceIdState';

export const useAuth = () => {
  const { redirect } = useRedirect();
  const navigate = useNavigate();

  const [getAuthTokensFromLoginToken] = useGetAuthTokensFromLoginTokenMutation();
  const [getCurrentUser] = useGetCurrentUserLazyQuery();

  const [TokenPair, setTokenPair]= useRecoilState(tokenPairState);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setCurrentUserWorkspace = useSetRecoilState(currentUserWorkspaceState);
  const setWorkspaces = useSetRecoilState(workspacesState);

  const client = useApolloClient();
  const goToRecoilSnapshot = useGotoRecoilSnapshot();

  const setCurrentWorkspaceId = useSetRecoilState(currentWorkspaceIdState)

    const workspaceId = useRecoilValue(currentWorkspaceIdState);

  const buildRedirectUrl = useCallback(
    (
      path: string,
      params: {
        workspaceInviteToken?: string;
      },
    ) => {
      const url = new URL(`${VITE_BACKEND_URL}${path}`);
      if (params.workspaceInviteToken !== null && params.workspaceInviteToken !== undefined) {
        url.searchParams.set('workspaceInviteToken', params.workspaceInviteToken);
      }
      return url.toString();
    },
    [], //workspacePublicData
  );

  const loadCurrentUser = useCallback(async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });

    const user = currentUserResult.data?.currentUser;
console.log(currentUserResult,'...................currentUserResult       ');

    if(!user) throw Error("user not found")
    setCurrentUser(user);

    // const currentUserWorkspace =  user?.currentUserWorkspace
    // if(!currentUserWorkspace) throw Error('currentUserWorkspace doesnt exist in useAuth')
    if (isDefined(user?.currentWorkspace)) {
      setCurrentUserWorkspace(user?.currentWorkspace);
      setCurrentWorkspaceId(user?.currentWorkspace?.id)
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

  },[]);

  const clearSession = useRecoilCallback(
    ({snapshot}) => async () => {
      const emptySnapshot = snapshot_UNSTABLE();

      const initialSnapshot = emptySnapshot.map(({ set }) => {
        return undefined;
      });

      await goToRecoilSnapshot(initialSnapshot);
      sessionStorage.clear();
      localStorage.clear();
      await client.clearStore();
      return undefined;
  });

  const handleSignOut = useCallback(async () => {
    await clearSession();
    navigate('/login');
  }, [clearSession]);

  const handleGoogleLogin = useCallback(
    (
      params: {
      workspaceInviteToken?: string;
    }
    ) => {
      redirect(buildRedirectUrl('/google/auth', params));
    },
    [buildRedirectUrl, redirect],
  );

  const handleGetAuthTokensFromLoginToken = useCallback(
     async (loginToken: string) => {

      const response = await getAuthTokensFromLoginToken({
        variables: { loginToken },
      });

      const accessToken = response.data?.getAuthTokensFromLoginToken?.accessToken;
      const token = accessToken?.token;
      if(!token) throw Error("token doesn't exist");
      const expiresAt = accessToken?.expiresAt;
      if(!expiresAt) throw Error("expiresAt doesn't exist");

      setTokenPair({accessToken : {
        token,
        expiresAt
      }});

      cookieStorage.setItem(
        'accessToken',
        JSON.stringify(
          {accessToken : {
            token,
            expiresAt
          }}
        ),
      );

      console.log("...............response.........",response);
      
      await loadCurrentUser();

      navigate('/login')
    }
  ,[]);


  return {
    logOut: handleSignOut,
    signInWithGoogle: handleGoogleLogin,
    getAuthTokensFromLoginToken: handleGetAuthTokensFromLoginToken,
    loadCurrentUser: loadCurrentUser
  };
}