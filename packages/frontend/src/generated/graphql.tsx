import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type Maybe<T> = T | null;
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ConnectionCursor: any;
  Date: any;
  DateTime: string;
  JSON: any;
  JSONObject: any;
  UUID: any;
  Upload: any;
};



export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['UUID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  isWorkspaceSetup: Scalars['Boolean']
  currentUserWorkspace?: Maybe<UserWorkspace>;
};

export type UserWorkspace = {
  __typename?: 'UserWorkspace';
  id: Scalars['UUID'];
  name: Scalars['String'];
  role: Scalars['String'];
  isWorkspaceSetup: Scalars['Boolean']
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
  // refreshToken: AuthToken;
};

export type currentUserWorkspace = {

}

export const GetAuthTokensFromLoginTokenDocument = gql`
  mutation GetAuthTokensFromLoginToken($loginToken: String!) {
    getAuthTokensFromLoginToken(loginToken: $loginToken) {
      workspaceIds
      userDetails {
        email
        firstName
        lastName
      }
      accessToken {
        expiresAt
        token
      }
    }
}`;

export type GetAuthTokensFromLoginTokenMutationVariables = Exact<{
  loginToken: Scalars['String'];
}>;
export type GetAuthTokensFromLoginTokenMutation = {
  __typename?: 'Mutation';
  getAuthTokensFromLoginToken?: {
    __typename?: 'AuthResponse';
    workspaceIds: string;
    access_token: string;
    accessToken: {
      __typename?: 'AuthToken';
      token: string;
      expiresAt: string; // or Date, depending on your setup
    };
    userDetails: {
      __typename?: 'UserDetails';
      firstName: string;
      lastName: string;
      email: string;
    };
  };
};

export function useGetAuthTokensFromLoginTokenMutation(baseOptions?: Apollo.MutationHookOptions<GetAuthTokensFromLoginTokenMutation, GetAuthTokensFromLoginTokenMutationVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useMutation<GetAuthTokensFromLoginTokenMutation, GetAuthTokensFromLoginTokenMutationVariables>(GetAuthTokensFromLoginTokenDocument, options);
}


export const UserQueryFragmentFragmentDoc = gql`
    fragment UserQueryFragment on user {
    id
    email
    firstName
    inviteToken
    lastName
    currentWorkspace {
      id
      name
      isWorkspaceSetup
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
export type GetCurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'User', id: any, firstName: string, lastName: string, email: string, canAccessFullAdminPanel: boolean, canImpersonate: boolean, supportUserHash?: string | null, userVars: any, workspaceMember?: { __typename?: 'WorkspaceMember', id: any, colorScheme: string, avatarUrl?: string | null, locale?: string | null, userEmail: string, timeZone?: string | null, dateFormat?: any | null, timeFormat?: any | null, name: { __typename?: 'FullName', firstName: string, lastName: string } } | null, workspaceMembers?: Array<{ __typename?: 'WorkspaceMember', id: any, colorScheme: string, avatarUrl?: string | null, locale?: string | null, userEmail: string, timeZone?: string | null, dateFormat?: any | null, timeFormat?: any | null, name: { __typename?: 'FullName', firstName: string, lastName: string } }> | null, deletedWorkspaceMembers?: Array<{ __typename?: 'DeletedWorkspaceMember', id: any, avatarUrl?: string | null, userEmail: string, name: { __typename?: 'FullName', firstName: string, lastName: string } }> | null, currentUserWorkspace?: { __typename?: 'UserWorkspace', settingsPermissions?: Array<any> | null, objectRecordsPermissions?: Array<any> | null } | null, currentWorkspace?: { __typename?: 'Workspace', id: any, displayName?: string | null, logo?: string | null, inviteHash?: string | null, allowImpersonation: boolean, isPublicInviteLinkEnabled: boolean, isGoogleAuthEnabled: boolean, isMicrosoftAuthEnabled: boolean, isPasswordAuthEnabled: boolean, subdomain: string, hasValidEnterpriseKey: boolean, customDomain?: string | null, isCustomDomainEnabled: boolean, metadataVersion: number, workspaceMembersCount?: number | null, workspaceUrls: { __typename?: 'WorkspaceUrls', subdomainUrl: string, customUrl?: string | null }, featureFlags?: Array<{ __typename?: 'FeatureFlagDTO', value: boolean }> | null, currentBillingSubscription?: { __typename?: 'BillingSubscription', id: any, billingSubscriptionItems?: Array<{ __typename?: 'BillingSubscriptionItem', id: any, hasReachedCurrentPeriodCap: boolean, billingProduct?: { __typename?: 'BillingProduct', name: string, description: string, metadata: { __typename?: 'BillingProductMetadata' } } | null }> | null } | null, billingSubscriptions: Array<{ __typename?: 'BillingSubscription', id: any }>, defaultRole?: { __typename?: 'Role', id: string, label: string, description?: string | null, icon?: string | null, canUpdateAllSettings: boolean, isEditable: boolean, canReadAllObjectRecords: boolean, canUpdateAllObjectRecords: boolean, canSoftDeleteAllObjectRecords: boolean, canDestroyAllObjectRecords: boolean } | null } | null, workspaces: Array<{ __typename?: 'UserWorkspace', workspace?: { __typename?: 'Workspace', id: any, logo?: string | null, displayName?: string | null, subdomain: string, customDomain?: string | null, workspaceUrls: { __typename?: 'WorkspaceUrls', subdomainUrl: string, customUrl?: string | null } } | null }> }
 User: {
  __typename?: 'User';
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  currentWorkspace?: {
    __typename?: 'Workspace';
    id: string;
    name: string;
  } | null;
  workspaces: Array<{
    __typename?: 'WorkspaceMember';
    id: string;
    role: string; // or use enum Role if defined
    workspace: {
      __typename?: 'Workspace';
      id: string;
      name: string;
    };
  }>;
};
};

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
  const options = { ...defaultOptions, ...baseOptions }
  return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
}


export const LoginMutation = gql`
  mutation Login($email: String!, $password: String!, $workspaceInviteToken: String) {
    login(authInput: { email: $email, password: $password, workspaceInviteToken: $workspaceInviteToken })
  }
`