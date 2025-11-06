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
} from '@src/generated/graphql';
import { isDefined } from '@src/utils/validation/isDefined';

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
