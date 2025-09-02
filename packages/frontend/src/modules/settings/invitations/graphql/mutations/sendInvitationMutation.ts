import { gql } from '@apollo/client';


export const sendInvitationMutation = gql`
  mutation sendWorkspaceInvitations($emails: [String!]!) {
    sendInvitations(emails: $emails) {
      errors
      result {
        email
        expiresAt
        id
      }
      success
    }
  }
`;

export const deleteWorkspaceInvitationMutation = gql`
  mutation deleteWorkspaceInvitation($appTokenId: String!) {
    deleteWorkspaceInvitation(appTokenId: $appTokenId) 
  }
`;