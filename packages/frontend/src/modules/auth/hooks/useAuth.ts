import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  snapshot_UNSTABLE,
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  useGetAuthTokensFromLoginTokenMutation,
  useGetCurrentUserLazyQuery,
  useCheckUserExistsLazyQuery,
} from '@src/generated/graphql';
import { VITE_BACKEND_URL } from '@src/config';
import { cookieStorage } from '@src/utils/cookie-storage';
import { isDefined } from '@src/utils/validation/isDefined';
import { workspacesState } from '@src/modules/auth/states/workspaces';
import { tokenPairState } from '@src/modules/auth/states/tokenPairState';
import { currentUserState } from '@src/modules/auth/states/currentUserState';
import { useRedirect } from '@src/modules/domain-manager/hooks/useRedirect';
import { currentWorkspaceIdState } from '@src/modules/auth/states/currentWorkspaceIdState';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';

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
  const [checkUserExistsQuery, { data: checkUserExistsData }] =
    useCheckUserExistsLazyQuery();

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
    [],
  );

  const loadCurrentUser = useCallback(async () => {
    const currentUserResult = await getCurrentUser({
      fetchPolicy: 'network-only',
    });
    const user = currentUserResult.data?.currentUser;
    if(!user) throw Error("user not found")
    setCurrentUser(user);
    if (isDefined(user?.currentWorkspace)) {
      setCurrentUserWorkspace(user?.currentWorkspace);
      setCurrentWorkspaceId(user?.currentWorkspace?.id)
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

  const handleSetAuthTokens = useCallback(
    (tokens: AuthTokenPair) => {
      setTokenPair(tokens);
      cookieStorage.setItem('tokenPair', JSON.stringify(tokens));
    },
    [setTokenPair],
  );

  const handleGetAuthTokensFromLoginToken = useCallback(
     async (loginToken: string) => {

      const getAuthTokensResult = await getAuthTokensFromLoginToken({
        variables: { loginToken },
      });

      if (isDefined(getAuthTokensResult.errors)) {
        throw getAuthTokensResult.errors;
      }

      if (!getAuthTokensResult.data?.getAuthTokensFromLoginToken) {
        throw new Error('No getAuthTokensFromLoginToken result');
      }

      handleSetAuthTokens(
        getAuthTokensResult.data.getAuthTokensFromLoginToken.tokens,
      );

      await loadCurrentUser();
      navigate('/login')
    }
  ,[]);


  return {
    logOut: handleSignOut,
    signInWithGoogle: handleGoogleLogin,
    getAuthTokensFromLoginToken: handleGetAuthTokensFromLoginToken,
    loadCurrentUser: loadCurrentUser,
    checkUserExists: { checkUserExistsData, checkUserExistsQuery },
  };
}