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