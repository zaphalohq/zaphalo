import { gql } from '@apollo/client';

export const UPDATE_ROLE = gql`
  mutation updateUserRole($userId: String!, $role: String!) {
    updateUserRole(userId: $userId, role: $role) {
      id
    }
  }
`;

export const DELETE_WORKSPACE_MEMBER = gql`
  mutation deleteWorkspaceMember($userId: String!) {
    deleteWorkspaceMember(userId: $userId) {
      id
    }
  }
`;

export const SUSPEND_WORKSPACE_MEMBER = gql`
  mutation suspendWorkspaceMember($userId: String!) {
    suspendWorkspaceMember(userId: $userId) {
      id
    }
  }
`;
