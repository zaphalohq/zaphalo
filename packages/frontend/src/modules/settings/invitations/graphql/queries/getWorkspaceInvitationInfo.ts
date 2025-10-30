import { gql } from '@apollo/client';

export const GET_WORKSPACE_INVITATION_INFO = gql`
  query findWorkspaceInvitations {
    findWorkspaceInvitations {
      email
      id
      expiresAt
    }
  }
`;
