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
    }
  }
`;