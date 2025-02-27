import { gql } from '@apollo/client';

export const RegisterMutation = gql`
mutation Register($username: String!, $email: String!, $password: String!) {
    Register(Register: {username: $username, email: $email, password: $password}) {
    id
  }
}
`;


