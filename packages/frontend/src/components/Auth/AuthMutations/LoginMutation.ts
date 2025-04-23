// LOGIN_MUTATION.js
import { gql } from '@apollo/client';

export const LoginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(authInput: { username: $username, password: $password }) {
      access_token
      workspaceIds
    }
  }
`;

