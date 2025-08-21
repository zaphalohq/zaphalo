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
  isWorkspaceSetup: Scalars['Boolean'];
};

export type Workspace = {
  __typename?: 'UserWorkspace';
  id: Scalars['UUID'];
  name: Scalars['String'];
  profileImg: Scalars['String']
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
      isWorkspaceSetup,
      profileImg,
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
export type GetCurrentUserQuery = {
  __typename?: 'Query', currentUser: { __typename?: 'User', id: any, firstName: string, lastName: string, email: string, canAccessFullAdminPanel: boolean, canImpersonate: boolean, supportUserHash?: string | null, userVars: any, workspaceMember?: { __typename?: 'WorkspaceMember', id: any, colorScheme: string, avatarUrl?: string | null, locale?: string | null, userEmail: string, timeZone?: string | null, dateFormat?: any | null, timeFormat?: any | null, name: { __typename?: 'FullName', firstName: string, lastName: string } } | null, workspaceMembers?: Array<{ __typename?: 'WorkspaceMember', id: any, colorScheme: string, avatarUrl?: string | null, locale?: string | null, userEmail: string, timeZone?: string | null, dateFormat?: any | null, timeFormat?: any | null, name: { __typename?: 'FullName', firstName: string, lastName: string } }> | null, deletedWorkspaceMembers?: Array<{ __typename?: 'DeletedWorkspaceMember', id: any, avatarUrl?: string | null, userEmail: string, name: { __typename?: 'FullName', firstName: string, lastName: string } }> | null, currentUserWorkspace?: { __typename?: 'UserWorkspace', settingsPermissions?: Array<any> | null, objectRecordsPermissions?: Array<any> | null } | null, currentWorkspace?: { __typename?: 'Workspace', id: any, displayName?: string | null, logo?: string | null, inviteHash?: string | null, allowImpersonation: boolean, isPublicInviteLinkEnabled: boolean, isGoogleAuthEnabled: boolean, isMicrosoftAuthEnabled: boolean, isPasswordAuthEnabled: boolean, subdomain: string, hasValidEnterpriseKey: boolean, customDomain?: string | null, isCustomDomainEnabled: boolean, metadataVersion: number, workspaceMembersCount?: number | null, workspaceUrls: { __typename?: 'WorkspaceUrls', subdomainUrl: string, customUrl?: string | null }, featureFlags?: Array<{ __typename?: 'FeatureFlagDTO', value: boolean }> | null, currentBillingSubscription?: { __typename?: 'BillingSubscription', id: any, billingSubscriptionItems?: Array<{ __typename?: 'BillingSubscriptionItem', id: any, hasReachedCurrentPeriodCap: boolean, billingProduct?: { __typename?: 'BillingProduct', name: string, description: string, metadata: { __typename?: 'BillingProductMetadata' } } | null }> | null } | null, billingSubscriptions: Array<{ __typename?: 'BillingSubscription', id: any }>, defaultRole?: { __typename?: 'Role', id: string, label: string, description?: string | null, icon?: string | null, canUpdateAllSettings: boolean, isEditable: boolean, canReadAllObjectRecords: boolean, canUpdateAllObjectRecords: boolean, canSoftDeleteAllObjectRecords: boolean, canDestroyAllObjectRecords: boolean } | null } | null, workspaces: Array<{ __typename?: 'UserWorkspace', workspace?: { __typename?: 'Workspace', id: any, logo?: string | null, displayName?: string | null, subdomain: string, customDomain?: string | null, workspaceUrls: { __typename?: 'WorkspaceUrls', subdomainUrl: string, customUrl?: string | null } } | null }> }
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

export const UpdateContactMute = gql`
mutation UpdateContact(
  $id: String!,
  $contactName: String!,
  $phoneNo: Float!,
  $profileImg: String,
) {
  UpdateContact(UpdateContact: {
  id: $id, 
  contactName: $contactName, 
  phoneNo: $phoneNo, 
  profileImg: $profileImg,
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

export const findDefaultSelectedInstants = gql`query MyQuery {
  findDefaultSelectedInstants {
    phoneNumberId
  }
}`

export const findOrCreateChannel = gql`
  mutation FindOrCreateChannel($phoneNo: String!) {
    findExistingChannelByPhoneNoOrCreateChannel(phoneNo: $phoneNo) {
      channelName
      id
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

export const MakeUnseenMsgSeen = gql`
mutation makeUnseenMsgSeenByMsgId($messageId : String!){
  makeUnseenMsgSeenByMsgId(messageId: $messageId){
    success
    message
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
    messageType
    attachment {
      originalname
    }
  }
}`

export const SEND_MESSAGE = gql`
  mutation SendMessage($sendMessageInput: SendMessageInput!) {
  sendMessage(sendMessageInput: $sendMessageInput) {
    textMessage
    sender {
      id
      phoneNo
    }
    createdAt
    attachmentUrl
    messageType
    attachment {
      originalname
    }
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

export const GenerateInviteLink = gql`
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
// WhatsApp Account

export const WhatsAppAccountCreate = gql`
mutation WaAccountCreate($whatsAppAccountData: WaAccountDto!) {
  WaAccountCreate(whatsAppAccountData: $whatsAppAccountData) {
    id
    name
  }
}`;

export const WhatsAppAccountSave = gql`
mutation WaAccountSave($whatsAppAccountData: WaAccountDto!) {
  WaAccountSave(whatsAppAccountData: $whatsAppAccountData) {
    id
    name
  }
}`;

export const WhatsAppAccountSync = gql`
mutation WaAccountSync($whatsAppAccountData: WaAccountDto!) {
  WaAccountSync(whatsAppAccountData: $whatsAppAccountData) {
    id
    name
  }
}
`;

export const WhatsAppAccountTestConnection = gql(`
mutation WaAccountTestConnection($whatsAppAccountData: WaAccountDto!) {
  WaAccountTestConnection(whatsAppAccountData: $whatsAppAccountData) {
    id
    name
  }
}`
)


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
      waWebhookToken
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

export const WhatsappSyncAndUpdateInstants = gql`
mutation SyncAndUpdateInstants(
  $id: String!,
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  SyncAndUpdateInstants(
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

export const WhatsappTestAndUpdateInstants = gql`
mutation TestAndUpdateInstants(
  $id: String!,
  $name: String!,
  $appId: String!,
  $phoneNumberId: String!,
  $businessAccountId: String!,
  $accessToken: String!,
  $appSecret: String!
) {
  TestAndUpdateInstants(
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
  $waAccountId : String!
  ){
    DeleteInstants(waAccountId: $waAccountId) {
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
query findAllTemplate($currentPage : Int!, $itemsPerPage : Int!){
    findAllTemplate(currentPage: $currentPage, itemsPerPage: $itemsPerPage){
    totalPages
    allTemplates{
      account {
        id
      }
      attachment {
        id
        originalname
        name
      }
      bodyText
      category
      button {
        phone_number
        text
        type
        url
      }
      footerText
      headerText
      headerType
      id
      language
      status
      templateName
      waTemplateId
      templateImg
      variables {
        name
        value
      }
    }
  }
}`


export const findAllApprovedTemplate = gql`
query findAllApprovedTemplate {
    findAllApprovedTemplate {
    account {
      id
    }
    attachment {
      id
      originalname
      name
    }
    bodyText
    category
    button {
      phone_number
      text
      type
      url
    }
    footerText
    headerText
    headerType
    id
    language
    status
    templateName
    waTemplateId
    templateImg
    variables {
      name
      value
    }
  }
}`

export const SUBMIT_TEMPLATE = gql`
mutation SubmitTemplate($templateData: WaTemplateRequestInput!, $waTemplateId: String, $dbTemplateId: String) {
  submitWaTemplate(templateData: $templateData, waTemplateId: $waTemplateId, dbTemplateId: $dbTemplateId) {
    success
    message
    error
  }
}`;


export const SAVE_TEMPLATE = gql`
mutation saveTemplate($templateData: WaTemplateRequestInput!, $dbTemplateId: String) {
  saveTemplate(templateData: $templateData, dbTemplateId: $dbTemplateId) {
    success
    message
    error
  }
}`;

export const WaTestTemplate = gql`
mutation testTemplate($testTemplateData: WaTestTemplateInput!){
  testTemplate(testTemplateData: $testTemplateData){
    success
  }
}
`

export const Send_Template_Message = gql`
  mutation sendTemplateMessage {
  sendTemplateToWhatssapp
}
`;

export const SEND_TEMPLATE_TO_WHATSAPP = gql`
  mutation BroadcastTemplate($broadcastData: BroadcastReqDto!) {
    BroadcastTemplate(broadcastData: $broadcastData){
    success
    message
    error
  }
  }
`;


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
  query systemConfig {
    systemConfig {
      authProviders {
        google
      }
    }
  }
`;

export function useGetSystemStatus() {
  return Apollo.useQuery(getSystemStatus);
}



export type CreateOneAttachmentVariables = Exact<{
  name: Scalars['String'];

}>;

export const CreateOneAttachmentDoc = gql`
  mutation CreateOneAttachmentMutation(
    $name: String!,
    $originalname: String!,
    $mimetype: String!,
    $size: Float!,
    $path: String!,
    $createdAt: DateTime!,
    $updatedAt: DateTime!) {
      CreateOneAttachment(
        Attachment: {
          name: $name,
          originalname: $originalname,
          mimetype: $mimetype,
          size: $size,
          path: $path,
          createdAt: $createdAt,
          updatedAt: $updatedAt,
        }
      ) {
      id
      name
      originalname
    }
  }
`;

export const DeleteOneAttachment = gql`
mutation DeleteOneAttachment($attachmentId: String!){
  DeleteOneAttachment(attachmentId: $attachmentId){
    success
    message
  }
}
`


export const findAllMailingList = gql`
  query FindAllMailingList($currentPage: Int!, $itemsPerPage: Int!) {
    findAllMailingList(currentPage: $currentPage, itemsPerPage: $itemsPerPage) {
    mailingList {
      id
      mailingListName
      createdAt
      totalContacts
      mailingContacts {
        contactName
        contactNo
        id
      }
    }
    totalPages
    }
  }
`;

export const SaveMailingContact = gql`
mutation saveMailingContact($saveMailingContact: MailingContact!){
  saveMailingContact(saveMailingContact : $saveMailingContact){
    success
  }
}
`

export const FindAllMailingContact = gql`
query findAllMailingContactByMailingListId($mailingListId : String!){
 findAllMailingContactByMailingListId(mailingListId : $mailingListId){
    contactName
    contactNo
    id
 }
}
`

export const DeleteMailingContact = gql`
mutation deleteMailingContact($mailingContactId : String!){
  deleteMailingContact(mailingContactId: $mailingContactId){
    success
 }
}
`

export const findAllBroadcasts = gql`
query findAllBroadcast($currentPage : Int!, $itemsPerPage : Int!) {
  findAllBroadcast(currentPage: $currentPage, itemsPerPage: $itemsPerPage) {
  allBroadcast {
      id
    broadcastName
    totalBroadcast
    totalBroadcastSend
    isBroadcastDone
    account {
      id
    }
    template {
      id
    }
    mailingList {
      id
      }
  }
  totalPages
    }
}`

export const SearchedBroadcast = gql`
query searchBroadcast($searchTerm: String){
  searchBroadcast(searchTerm: $searchTerm){
    searchedData
    totalCount
  }
}
`

export const SearchedTemplate = gql`
query searchedTemplate($searchTerm: String){
  searchedTemplate(searchTerm: $searchTerm){
    searchedData
    totalCount
  }
}
`

export const searchMailingList = gql`
query searchMailingList($searchTerm: String){
  searchMailingList(searchTerm: $searchTerm){
    searchedData
    totalCount
  }
}
`

// export const FindtemplateByDbId = gql`
// query findtemplateByDbId($dbTemplateId: String!){
//   findtemplateByDbId(dbTemplateId: $dbTemplateId){
//     id
//   }
// }
// `

export const FindTemplateByDbId = gql`
  query FindTemplateByDbId($dbTemplateId: String!) {
    findtemplateByDbId(dbTemplateId: $dbTemplateId) {
       account {
      id
    }
    attachment {
      id
      originalname
      name
    }
    bodyText
    category
    button {
      phone_number
      text
      type
      url
    }
    footerText
    headerText
    headerType
    id
    language
    status
    templateName
    waTemplateId
    templateImg
    variables {
      name
      value
    }
    }
  }
`;


export const SelectedMailingContact = gql`
  query SelectedMailingContact($mailingListId: String!, $currentPage: Int!, $itemsPerPage: Int!) {
    selectedMailingContact(
      mailingListId: $mailingListId
      currentPage: $currentPage
      itemsPerPage: $itemsPerPage
    ) {
      mailingContact {
        contactName
        contactNo
        createdAt
        id
      }
      totalPages
    }
  }
`;

export const GetMailingContacts = gql`
query GetMailingContacts($mailingListId: String!, 
                         $searchTerm: String) {
  searchAndPaginateContact(mailingListId: $mailingListId, 
                         searchTerm: $searchTerm) {
    totalCount
    mailingContact {
      id
      contactName
      contactNo
      createdAt
    }
  }
}`