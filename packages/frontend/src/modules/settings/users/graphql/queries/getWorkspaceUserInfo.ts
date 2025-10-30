import { gql } from '@apollo/client';

export const GET_WORKSPACE_USER_INFO = gql`
  query getWorkspaceMember {
  getWorkspaceMember {
    id
    members {
      id
      role
      active
      deletedAt
      user {
        email
        id
        firstName
        lastName
      }
    }
  }
}
`;
