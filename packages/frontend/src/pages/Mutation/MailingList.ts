import { gql } from '@apollo/client';

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
