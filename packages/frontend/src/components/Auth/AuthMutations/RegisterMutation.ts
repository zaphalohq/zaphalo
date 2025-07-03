import { gql } from '@apollo/client';

// export const RegisterMutation = gql`
// mutation Register($username: String!, $email: String!, $password: String!, $inviteToken: String!) {
//     Register(Register: {username: $username, email: $email, password: $password, inviteToken: $inviteToken}) {
//     id
//   }
// }
// `;





export const RegisterMutation = gql`
mutation Register($firstName: String!, $lastName: String!, $email: String!, $password: String!, $workspaceInviteToken: String) {
  Register(Register: {
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    password: $password,
    workspaceInviteToken: $workspaceInviteToken,
  }) {
    id
  }
}
`;


