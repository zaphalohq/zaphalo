import { WorkspaceAuthProvider } from 'src/modules/workspace/types/workspace.type';
import { User } from 'src/modules/user/user.entity';
import { Workspace } from 'src/modules/workspace/workspace.entity';


export type SignInUpBaseParams = {
  invitation?: string;
  workspace?: Workspace | null;
  // billingCheckoutSessionState?: string | null;
};

export type SignInUpNewUserPayload = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  picture?: string | null;
  password?: string | null;
  // locale?: keyof typeof APP_LOCALES | null;
};

export type PartialUserWithPicture = {
  picture?: string;
} & Partial<User>;

export type ExistingUserOrNewUser = {
  userData:
    | { type: 'existingUser'; existingUser: User }
    | {
        type: 'newUser';
        newUserPayload: SignInUpNewUserPayload;
      };
};

export type ExistingUserOrPartialUserWithPicture = {
  userData:
    | { type: 'existingUser'; existingUser: User }
    | {
        type: 'newUserWithPicture';
        newUserWithPicture: PartialUserWithPicture;
      };
};

export type AuthProviderWithPasswordType = {
  authParams:
    | {
        provider: Extract<WorkspaceAuthProvider, 'password'>;
        password: string;
      }
    | {
        provider: Exclude<WorkspaceAuthProvider, 'password'>;
      };
};
