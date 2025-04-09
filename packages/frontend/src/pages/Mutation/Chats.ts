import { gql } from "@apollo/client"

export const CreateContactMute = gql`
mutation CreateContacts(
  $contactName: String!,
  $phoneNo: Float!,
  $profileImg: String!,
) {
  CreateContacts(CreateContacts: {
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