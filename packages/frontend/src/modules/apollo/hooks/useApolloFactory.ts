import { InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { currentUserState } from '@src/modules/auth/states/currentUserState';
import { currentUserWorkspaceState } from '@src/modules/auth/states/currentUserWorkspaceState';
import { currentWorkspaceIdState } from '@src/modules/auth/states/currentWorkspaceIdState';
import { tokenPairState } from '@src/modules/auth/states/tokenPairState';
import { VITE_BACKEND_URL } from '@src/config';
import { useUpdateEffect } from '@src/hooks/useUpdateEffect';
import { isMatchingLocation } from '@src/utils/isMatchingLocation';

import { isDefined } from '@src/utils/validation/isDefined';
import { ApolloFactory, Options } from '../services/apollo.factory';
import { AppPath } from '@src/types/AppPath';

export const useApolloFactory = (options: Partial<Options<any>> = {}) => {
  // eslint-disable-next-line @nx/workspace-no-state-useref
  const apolloRef = useRef<ApolloFactory<NormalizedCacheObject> | null>(null);

  const navigate = useNavigate();
  const setTokenPair = useSetRecoilState(tokenPairState);
  const [currentWorkspace, setCurrentWorkspace] = useRecoilState(
    currentWorkspaceIdState,
  );
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useRecoilState(
    currentUserWorkspaceState,
  );
  const setCurrentUser = useSetRecoilState(currentUserState);
  const setCurrentUserWorkspace = useSetRecoilState(currentUserWorkspaceState);

  const location = useLocation();

  const apolloClient = useMemo(() => {
    apolloRef.current = new ApolloFactory({
      uri: `${VITE_BACKEND_URL}/graphql`,
      cache: new InMemoryCache({
        typePolicies: {
          RemoteTable: {
            keyFields: ['name'],
          },
        },
      }),

      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
      connectToDevTools: process.env.IS_DEBUG_MODE === 'true',
      currentWorkspaceMember: currentWorkspaceMember,
      currentWorkspace: currentWorkspace,
      onTokenPairChange: (tokenPair) => {
        setTokenPair(tokenPair);
      },
      onUnauthenticatedError: () => {
        setTokenPair(null);
        setCurrentUser(null);
        setCurrentWorkspaceMember(null);
        setCurrentWorkspace(null);
        setCurrentUserWorkspace(null);
        if (
          !isMatchingLocation(location, AppPath.Verify) &&
          !isMatchingLocation(location, AppPath.SignInUp) &&
          !isMatchingLocation(location, AppPath.Invite) &&
          !isMatchingLocation(location, AppPath.ResetPassword)
        ) {
          // setPreviousUrl(`${location.pathname}${location.search}`);
          navigate(AppPath.SignInUp);
        }
      },
      extraLinks: [],
      isDebugMode: process.env.IS_DEBUG_MODE === 'true',
      // Override options
      ...options,
    });

    return apolloRef.current.getClient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    setTokenPair,
    setCurrentUser,
    setCurrentWorkspaceMember,
    setCurrentWorkspace,
  ]);

  useUpdateEffect(() => {
    if (isDefined(apolloRef.current)) {
      apolloRef.current.updateWorkspaceMember(currentWorkspaceMember);
    }
  }, [currentWorkspaceMember]);

  useUpdateEffect(() => {
    if (isDefined(apolloRef.current)) {
      apolloRef.current.updateCurrentWorkspace(currentWorkspace);
    }
  }, [currentWorkspace]);

  return apolloClient;
};
