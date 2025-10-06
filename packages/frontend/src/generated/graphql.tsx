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
      inviteToken,
    }
    workspaceMembers {
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
mutation CreateContacts($CreateContacts: createContactsDto!) {
  CreateContacts(CreateContacts: $CreateContacts) {
    id
    contactName
    phoneNo
    profileImg
    defaultContact
    address
  }
}`

export const UpdateContactMute = gql`
mutation UpdateContact($UpdateContact: updateContactsDto!) {
  UpdateContact(UpdateContact: $UpdateContact) {
    id
    contactName
    phoneNo
    profileImg
    defaultContact
    address
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
    channelMembers {
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


export const SEND_MESSAGE = gql`
  mutation SendMessage($sendMessageInput: SendMessageInput!) {
  sendMessage(sendMessageInput: $sendMessageInput) {
    textMessage
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


export const SyncWhatsAppAccountTemplates = gql`
mutation syncWhatsAppAccountTemplates($waAccountId: String!) {
  syncWhatsAppAccountTemplates(waAccountId: $waAccountId) {
    waAccount {
      id
      name
    }
    message
    status
  }
}
`;

export const WhatsAppAccountTestConnection = gql(`
mutation WaAccountTestConnection($whatsAppAccountData: WaAccountDto!) {
  WaAccountTestConnection(whatsAppAccountData: $whatsAppAccountData) {
    message
    success
    error
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

export const ReadWaAccount = gql`
query readWaAccount($search: String, $limit: Int){
  readWaAccount(search: $search, limit: $limit){
    id
    name
  }
}`

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


export const ReadMailingList = gql`
query readMailingList($search: String, $limit: Int){
  readMailingList(search: $search, limit: $limit){
    id
    mailingListName
  }
}`

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


// Broadcast

export const ReadBroadcast = gql`
query readBroadcast($search: String, $limit: Int){
  readBroadcast(search: $search, limit: $limit){
    id
    name
  }
}`

export const SearchReadBroadcast = gql`
query searchReadBroadcast($page : Int!, $pageSize : Int!, $search: String, $filter: String) {
  searchReadBroadcast(page: $page, pageSize: $pageSize, search: $search, filter: $filter) {
    total
    totalPages
    currentPage
    broadcasts {
      id
      name
      createdAt
      status
      whatsappAccount {
        id
        name
      }
      template {
        id
        templateName
      }
      contactList {
        id
      }
    }
  }
}`


export const SaveBroadcast = gql`
  mutation saveBroadcast($broadcastData: BroadcastRequest!) {
    saveBroadcast(broadcastData: $broadcastData){
      broadcast {
        id
        name
        createdAt
        status
        whatsappAccount {
          id
        }
        template {
          id
          templateName
        }
        contactList {
          id
        }
      }
      message
      status
    }
  }
`;

export const GetBroadcast = gql`
query getBroadcast($broadcastId: String!) {
  getBroadcast(broadcastId: $broadcastId) {
    broadcast {
      id
      name
      createdAt
      status
      whatsappAccount {
        id
      }
      template {
        id
        templateName
      }
      contactList {
        id
      }
    }
    message
    status
  }
}`


// Whatsapp Template

export const GetTemplate = gql`
query getTemplate($templateId: String!) {
  getTemplate(templateId: $templateId) {
    template {
      id
      name
      templateName
      category
      language
      waTemplateId
      templateImg
      createdAt
      status
      footerText
      headerText
      headerType
      bodyText
      account {
        id
        name
      }
      attachment {
        id
        originalname
        name
      }
      button {
        phone_number
        text
        type
        url
      }
      variables {
        name
        value
      }
    }
    message
    status
  }
}`

export const ReadWaTemplate = gql`
query readWaTemplate($search: String, $limit: Int, $filter: JSONObject){
  readWaTemplate(search: $search, limit: $limit, filter: $filter){
    id
    name
    templateName
  }
}`

export const SearchReadWhatsappTemplate = gql`
query searchReadTemplate($page : Int!, $pageSize : Int!, $search: String, $filter: String) {
  searchReadTemplate(page: $page, pageSize: $pageSize, search: $search, filter: $filter) {
    total
    totalPages
    currentPage
    templates{
      id
      name
      templateName
      category
      language
      waTemplateId
      templateImg
      createdAt
      status
      footerText
      headerText
      headerType
      bodyText
      account {
        id
        name
      }
      attachment {
        id
        originalname
        name
      }
      button {
        phone_number
        text
        type
        url
      }
      variables {
        name
        value
      }
    }
  }
}`

export const SaveWhatsappTemplate = gql`
mutation saveTemplate($templateData: WaTemplateRequestInput!) {
  saveTemplate(templateData: $templateData) {
    template {
      id
      name
      templateName
      category
      language
      waTemplateId
      templateImg
      createdAt
      status
      footerText
      headerText
      headerType
      bodyText
      account {
        id
        name
      }
      attachment {
        id
        originalname
        name
      }
      button {
        phone_number
        text
        type
        url
      }
      variables {
        name
        value
      }
    }
    message
    status
  }
}`;


export const SubmitWhatsappTemplate = gql`
mutation submitTemplate($templateId: String!) {
  submitTemplate(templateId: $templateId) {
    template {
      id
      name
      templateName
      category
      language
      waTemplateId
      templateImg
      createdAt
      status
      footerText
      headerText
      headerType
      bodyText
      account {
        id
        name
      }
      attachment {
        id
        originalname
        name
      }
      button {
        phone_number
        text
        type
        url
      }
      variables {
        name
        value
      }
    }
    message
    status
  }
}`;


export const SyncTemplate = gql`
mutation syncTemplate($templateId: String!) {
  syncTemplate(templateId: $templateId) {
    template {
      id
      name
      templateName
      category
      language
      waTemplateId
      templateImg
      createdAt
      status
      footerText
      headerText
      headerType
      bodyText
      account {
        id
        name
      }
      attachment {
        id
        originalname
        name
      }
      button {
        phone_number
        text
        type
        url
      }
      variables {
        name
        value
      }
    }
    message
    status
  }
}`

// Messages

export const SearchReadChannelMessage = gql`
query channelMessage($channelId: String!, $page : Int!, $pageSize : Int!, $search: String, $filter: String) {
  searchReadChannelMessage(channelId: $channelId, page: $page, pageSize: $pageSize, search: $search, filter: $filter) {
    channel {
      id
      channelName
    }
    messages{
      textMessage
      createdAt
      attachmentUrl
      messageType
      sender {
        phoneNo
      }
      attachment {
        originalname
      }
    }
  }
}`

export const ChannelMessage = gql`
query messages($channelId: String!, $cursor: String, $limit : Int!){
  messages(channelId: $channelId, cursor: $cursor, limit: $limit, ) {
    cursor
    edges {
      id
      textMessage
      createdAt
      attachmentUrl
      messageType
      sender {
        phoneNo
      }
      attachment {
        originalname
      }
    }
    hasMore
  }
}`



export const SearchReadContacts = gql`
query searchReadContacts($page: Int!, $pageSize: Int!, $search: String, $filter: String) {
  searchReadContacts(page: $page, pageSize: $pageSize, search: $search, filter: $filter) {
    total,
    totalPages,
    currentPage,
    contacts {
      id
      contactName
      phoneNo
      profileImg
      address
    }
  }
}
`;

export const GetContactById = gql`
query getContactById($contactId: String!){
  getContactById(contactId: $contactId){
    id
    contactName
    phoneNo
    profileImg
    address
  }
}
`

export const searchReadMailingList = gql`
  query searchReadMailingList($page: Int!, $pageSize: Int!, $search: String, $filter: String){
    searchReadMailingList(page: $page, pageSize: $pageSize, search: $search, filter: $filter){
      total,
      totalPages,
      currentPage,
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
      broadcast {
        name
        id
        }
      }
    }
  }
`

export const deleteMailingListWithAllContacts = gql`
  mutation DeleteMailingList($mailingId: String!) {
    deleteMailingListWithAllContacts(mailingId: $mailingId) {
      success
      message
    }
  }
`;

export const searchReadAccount = gql`
 query searchReadAccount($page: Int!, $pageSize: Int!, $search: String){
    searchReadAccount(page: $page, pageSize: $pageSize, search: $search){
      total,
      totalPages,
      currentPage,
      accounts{
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
  }
`
export const GetWaAccount=gql`
  query getWaAccount($waAccountId: String!){
  getWaAccount(waAccountId: $waAccountId){
    id
    name
    appId
    appSecret
    phoneNumberId
    businessAccountId
    createdAt
    defaultSelected
    accessToken
    waWebhookToken
  }
}
`