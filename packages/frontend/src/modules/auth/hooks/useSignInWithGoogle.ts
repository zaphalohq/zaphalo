import { useParams, useSearchParams } from 'react-router-dom';

import { useAuth } from '@src/modules/auth/hooks/useAuth';
// import { BillingCheckoutSession } from '@/auth/types/billingCheckoutSession.type';

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
