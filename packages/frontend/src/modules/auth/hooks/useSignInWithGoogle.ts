import { useParams } from 'react-router-dom';
import { useAuth } from '@src/modules/auth/hooks/useAuth';

export const useSignInWithGoogle = () => {
  const workspaceInviteToken = useParams().workspaceInviteToken;
  const { signInWithGoogle } = useAuth();
  return {
    signInWithGoogle: () =>
      signInWithGoogle({
        workspaceInviteToken,
      }),
  };
};
