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
      expiresAt: string;
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
    role: string;
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

export const RegisterMutation = gql`
mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $workspaceInviteToken: String) {
  Register(Register: {
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $password,
    workspaceInviteToken: $workspaceInviteToken,
  }) {
    id
  }
}
`;


export const CreateContactMute = gql`
mutation CreateContacts(
  $contactName: String!,
  $phoneNo: Float!,
  $profileImg: String,
  $defaultContact: Boolean,
) {
  CreateContacts(CreateContacts: {
  contactName: $contactName, 
  phoneNo: $phoneNo, 
  profileImg: $profileImg,
  defaultContact: $defaultContact
  }) {
    id
  }
}`

export const findAllContacts = gql`
query findAllContacts {
  findAllContacts {
    contactName
    createdAt
    id
    phoneNo
    profileImg
    }
}
`

export const findAllChannel = gql`
query findAllChannel {
  findAllChannel {
    channelName
    id
    contacts {
      id
      phoneNo
    }
    messages {
      unseen
    }
  }
}
`

export const findChannelByPhoneNo = gql`
  query MyQuery($memberIds: String!) {
    findExistingChannelByPhoneNo(memberIds: $memberIds) {
      channelName
      id
      contacts {
        id
        phoneNo
      }
    }
  }
`;

export const findAllUnseen = gql`query MyQuery {
  findAllUnseen {
    unseen
    message
    channel {
      id
    }
    sender {
      phoneNo
    }
  }
}`

export const findMsgByChannelId = gql`query GetMessagesByChannel($channelId: String!) {
  findMsgByChannelId(channelId: $channelId) {
    textMessage
    sender {
      id
      phoneNo
    }
    createdAt
    attachmentUrl
  },
}`

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    success
  }
}
`;

export const updateChannelNameById = gql`
  mutation updateChannelNameById($channelId: String!, $updatedValue: String!) {
    updateChannelNameById(channelId: $channelId, updatedValue: $updatedValue) {
      channelName
    }
  }
`

export const GenerateInviteLink =  gql`
  mutation GenerateInviteLink($workspaceId: String!) {
    generateWorkspaceInvitation(workspaceId: $workspaceId)
  }
`;

export const InstantsSelection = gql`mutation InstantsSelection($instantsId: String!) {
  InstantsSelection(instantsId: $instantsId) {
        id
        name
        phoneNumberId
        businessAccountId
        defaultSelected
    }
}`


export const DeleteContact = gql`
mutation DeleteContact(
  $contactId : String!,
  ){
    DeleteContact(contactId: $contactId) {
    contactName
    createdAt
    phoneNo
    profileImg
    }
  }
`


export const WhatsappInstantsCreation = gql`
mutation CreateInstants(
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  CreateInstants(InstantsData: {
    name: $name,
    appId: $appId,
    phoneNumberId: $phoneNumberId,
    businessAccountId: $businessAccountId,
    accessToken: $accessToken,
    appSecret: $appSecret
  }) {
    id
    name
  }
}
`;

export const WhatsappInstantsSyncAndSave = gql`
mutation SyncAndSaveInstants(
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  SyncAndSaveInstants(InstantsData: {
    name: $name,
    appId: $appId,
    phoneNumberId: $phoneNumberId,
    businessAccountId: $businessAccountId,
    accessToken: $accessToken,
    appSecret: $appSecret
  }) {
    id
    name
  }
}
`;

export const WhatsappInstantsTestAndSave = gql(`
  mutation TestAndSaveInstants(
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  TestAndSaveInstants(InstantsData: {
    name: $name,
    appId: $appId,
    phoneNumberId: $phoneNumberId,
    businessAccountId: $businessAccountId,
    accessToken: $accessToken,
    appSecret: $appSecret
  }) {
    id
    name
  }
}`)


export const findAllInstants = gql`
  query findAllInstants{
    findAllInstants {
      id
      name
      appId
      phoneNumberId
      businessAccountId
      accessToken
      appSecret
      defaultSelected
    }
  }
`;

export const UpdatedInstants = gql`
mutation updateInstants(
  $id: String!,
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  updateInstants(
    updateInstants: {
    id: $id
    name: $name, 
    appId: $appId, 
    phoneNumberId: $phoneNumberId, 
    businessAccountId: $businessAccountId, 
    accessToken: $accessToken, 
    appSecret: $appSecret
    }) {
    id
  }
}`

export const DeleteInstantsMutation = gql`
mutation DeleteInstants(
  $id : String!,
  ){
    DeleteInstants(DeleteInstants: {id: $id}) {
      accessToken
      appId
      createdAt
      appSecret
      businessAccountId
    }
  }
`



export const findCountForDash = gql`query findWorkspaceByIdForDash($workspaceId: String!) {
    findWorkspaceByIdForDash(workspaceId: $workspaceId) {
    contacts {
      contactName
    }
    workspace {
      channels {
        channelName
        messages {
          textMessage
        }
      }
    }
  }
  }`

export const CREATE_MAILING_LIST = gql`
  mutation CreateMailingList($mailingListInput: MailingListInputDto!) {
    CreateMailingList(mailingListInput: $mailingListInput) {
    id
    createdAt
    mailingListName
    }
  }
`;


export const FindAll_Mailing_List = gql`query findAllMailingList {
  findAllMailingList {
    id
    mailingListName
  }
}`




export const GET_TEMPLATE_STATUS = gql`
mutation getTemplateStatus($templateId: String!) {
  getTemplateStatus(templateId: $templateId) {
    success
    data
    error
  }
}
`;


export const findWaAllTemplate = gql`
query findAllTemplate {
    findAllTemplate {
      account
      bodyText
      button {
        phone_number
        text
        type
        url
      }
      category
      footerText
      headerType
      header_handle
      id
      language
      status
      templateId
      templateName
      fileUrl
  }
}`

export const SUBMIT_TEMPLATE = gql`
mutation SubmitTemplate($templateData: WaTemplateRequestInput!) {
  submitTemplate(templateData: $templateData) {
    success
    data
    error
  }
}`;

export const Send_Template_Message = gql`
  mutation sendTemplateMessage {
  sendTemplateToWhatssapp
}
`;

export const SEND_TEMPLATE_TO_WHATSAPP = gql`
  mutation BroadcastTemplate($broadcastData: BroadcastReqDto!) {
    BroadcastTemplate(broadcastData: $broadcastData){
    URL
    broadcastName
  }
  }
`;

// mutation MyMutation {
//   BroadcastTemplate(
//     broadcastData: {templateId: "", templateName: "", mailingListId: "", mailingListName: "", headerType: "", language: "", variables: ""}
//   ) {
//     URL
//     broadcastName
//   }
// }



export const UpdateWorkspaceDetails = gql`
mutation UpdateWorkspaceDetails(
  $workspaceId: String!,
  $workspaceName: String!,
  $profileImg: String
) {
  updateWorkspaceDetails(
    WorkspaceUpdateInput: {
      workspaceId: $workspaceId,
      workspaceName: $workspaceName,
      profileImg: $profileImg
    }
  ) {
    id
    name
    profileImg
  }
}
`

export const getSystemStatus = gql`
  query SystemStatus {
    getSystemStatus
  }
`;


export function useGetSystemStatus(){
  return Apollo.useQuery(getSystemStatus);
}