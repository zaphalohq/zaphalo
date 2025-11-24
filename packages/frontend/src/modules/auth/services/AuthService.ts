import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  UriFunction,
} from '@apollo/client';
import { gql } from "@apollo/client";

import {
  RenewTokenMutation,
  WorkspaceTokenMutation,
} from '@src/generated/graphql';
import { isDefined } from '@src/utils/validation/isDefined';
import { cookieStorage } from '@src/utils/cookie-storage';
import { VITE_BACKEND_URL } from '@src/config';


export const switchWorkspace = async (
  workspaceId
) => {
  const stringTokenPair = cookieStorage.getItem('tokenPair');
  const tokenPair = isDefined(stringTokenPair)
    ? (JSON.parse(stringTokenPair) as AuthTokenPair)
    : undefined;
  if (!tokenPair) {
    throw new Error('Refresh token is not defined');
  }
  const data = await switchWorkspaceMutation(`${VITE_BACKEND_URL}/graphql`, tokenPair.refreshToken.token, workspaceId);
  cookieStorage.setItem('tokenPair', JSON.stringify(data?.workspaceToken.tokens));
}

const switchWorkspaceMutation = async (
  uri: string,
  refreshToken: string,
  workspaceId: string,
) => {
  if (!refreshToken) return null;

  const httpLink = new HttpLink({ uri });

  const client = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: new InMemoryCache({}),
  });
  const { data, errors } = await client.mutate({
    mutation: WorkspaceTokenMutation,
    variables: {
      appToken: refreshToken,
      workspaceId: workspaceId,
    },
    fetchPolicy: 'network-only',
  });
  if (isDefined(errors)) {
    throw new Error('Something went wrong during token renewal');
  }
  return data;
}


export const renewToken = async (
  uri, tokenPair
) => {
  if (!tokenPair) {
    throw new Error('Refresh token is not defined');
  }

  const data = await renewTokenMutation(uri, tokenPair.refreshToken.token);
  return data?.renewToken.tokens;

}

const renewTokenMutation = async (
  uri: string,
  refreshToken: string,
) => {
  if (!refreshToken) return null;

  const httpLink = new HttpLink({ uri });

  const client = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: new InMemoryCache({}),
  });
  const { data, errors } = await client.mutate({
    mutation: RenewTokenMutation,
    variables: {
      appToken: refreshToken,
    },
    fetchPolicy: 'network-only',
  });
  if (isDefined(errors)) {
    throw new Error('Something went wrong during token renewal');
  }
  return data;
}
