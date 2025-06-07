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
  useSetRecoilState,
} from 'recoil';


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
  const emptySnapshot = snapshot_UNSTABLE();

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
    // [workspacePublicData],
  );

  const loadCurrentUser = useCallback(async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });

    const user = currentUserResult.data?.currentUser;

    setCurrentUser(user);

    if (isDefined(user.currentUserWorkspace)) {
      setCurrentUserWorkspace(user.currentUserWorkspace);
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
  });

  const clearSession = useRecoilCallback(
    ({snapshot}) => async () => {
      const initialSnapshot = emptySnapshot.map(({ set }) => {
        return undefined;
      });

      goToRecoilSnapshot(initialSnapshot);
      sessionStorage.clear();
      localStorage.clear();
      await client.clearStore();
      return undefined;
  });

  const handleSignOut = useCallback(async () => {
      loadCurrentUser();

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
      setTokenPair(
        response.data?.getAuthTokensFromLoginToken.access_token,
      );
      cookieStorage.setItem(
        'accessToken',
        JSON.stringify(
          response.data.getAuthTokensFromLoginToken.access_token,
        ),
      );
      loadCurrentUser();

      //to be removed
      const access_token = localStorage.getItem('access_token')
      const workspaceIds = JSON.parse(response.data.getAuthTokensFromLoginToken.workspaceIds)
      setItem('workspaceIds', workspaceIds)
      sessionStorage.setItem('workspaceId', workspaceIds[0]);
      setItem('userDetails',{ name : response.data.getAuthTokensFromLoginToken.userDetails.name, email : response.data.getAuthTokensFromLoginToken.userDetails.email })
      navigate('/dashboard')
    }
  );


  return {
    logOut: handleSignOut,
    signInWithGoogle: handleGoogleLogin,
    getAuthTokensFromLoginToken: handleGetAuthTokensFromLoginToken,
  };
}