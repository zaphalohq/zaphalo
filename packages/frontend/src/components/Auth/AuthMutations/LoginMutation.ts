// LOGIN_MUTATION.js
import { gql } from '@apollo/client';

export const LoginMutation = gql`
  mutation Login($username: String!, $password: String!) {
    login(authInput: { username: $username, password: $password }) {
      workspaceIds

    accessToken {
      expiresAt
      token
    }
    workspaces {
      id
      role
      workspace {
        id
        name
      }
    }
    }
  }
`;

//     mutation GetAuthTokensFromLoginToken($loginToken: String!) {
//   getAuthTokensFromLoginToken(loginToken: $loginToken) {
//     workspaceIds
//     userDetails {
//       email
//       name
//     }
//     access_token
//     accessToken {
//       expiresAt
//       token
//     }
//   }
// }

