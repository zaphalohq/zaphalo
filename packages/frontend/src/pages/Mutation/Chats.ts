import { gql } from "@apollo/client"

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
    message
    sender {
      id
      phoneNo
    }
    createdAt,
    attachment
  },
}`

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: SendMessageInput!) {
  sendMessage(input: $input) {
    message
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