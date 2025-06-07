import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;


export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['UUID'];
  username: Scalars['String'];
  currentUserWorkspace?: Maybe<UserWorkspace>;
};

export type UserWorkspace = {
  __typename?: 'UserWorkspace';
  id: Scalars['UUID'];
  name: Scalars['String'];
  role: Scalars['String'];
};

export type Workspace = {
  __typename?: 'UserWorkspace';
  id: Scalars['UUID'];
  name: Scalars['String'];
};


export type AuthToken = {
  __typename?: 'AuthToken';
  expiresAt: Scalars['DateTime'];
  token: Scalars['String'];
};

export type AuthTokenPair = {
  __typename?: 'AuthTokenPair';
  accessToken: AuthToken;
  refreshToken: AuthToken;
};


export const GetAuthTokensFromLoginTokenDocument = gql`
    mutation GetAuthTokensFromLoginToken($loginToken: String!) {
  getAuthTokensFromLoginToken(loginToken: $loginToken) {
    access_token
      workspaceIds
      userDetails {
      email
      name
    }
  }
}`;

export function useGetAuthTokensFromLoginTokenMutation(baseOptions?: Apollo.MutationHookOptions<GetAuthTokensFromLoginTokenMutation, GetAuthTokensFromLoginTokenMutationVariables>) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<GetAuthTokensFromLoginTokenMutation, GetAuthTokensFromLoginTokenMutationVariables>(GetAuthTokensFromLoginTokenDocument, options);
}


export const UserQueryFragmentFragmentDoc = gql`
    fragment UserQueryFragment on User {
  id
  username
  email
  currentWorkspace {
    id
    name
  }
  workspaces {
    id
    role
    workspace {
      id
      name
    }
  }
}`;

export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  currentUser {
    ...UserQueryFragment
  }
}
    ${UserQueryFragmentFragmentDoc}`;

export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}