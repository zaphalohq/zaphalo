import { gql } from "@apollo/client";



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
      select
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