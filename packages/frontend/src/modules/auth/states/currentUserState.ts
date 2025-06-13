import { User } from 'src/generated/graphql';
import { createState } from 'src/utils/createState';


export type CurrentUser = Pick<
  User,
  | 'id'
  | 'email'
  | 'firstName'
  | 'lastName'
  | 'currentUserWorkspace'
>;

export const currentUserState = createState<CurrentUser | null>({
  key: 'currentUserState',
  defaultValue: null,
});
