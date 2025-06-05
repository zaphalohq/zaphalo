import { useCallback } from 'react';
import { VITE_BACKEND_URL } from '@src/config';
import { useRedirect } from '@src/modules/domain-manager/hooks/useRedirect';

export const useAuth = () => {
  const { redirect } = useRedirect();


  const buildRedirectUrl = useCallback(
    (
      path: string,
      params: {
        // workspacePersonalInviteToken?: string;
        workspaceInviteToken?: string;
        // billingCheckoutSession?: BillingCheckoutSession;
      },
    ) => {
      const url = new URL(`${VITE_BACKEND_URL}${path}`);

      if (params.workspaceInviteToken !== null || params.workspaceInviteToken !== undefined) {
        url.searchParams.set('workspaceInviteToken', params.workspaceInviteToken);
      }
      // if (isDefined(params.workspacePersonalInviteToken)) {
      //   url.searchParams.set(
      //     'inviteToken',
      //     params.workspacePersonalInviteToken,
      //   );
      // }
      // if (isDefined(params.billingCheckoutSession)) {
      //   url.searchParams.set(
      //     'billingCheckoutSessionState',
      //     JSON.stringify(params.billingCheckoutSession),
      //   );
      // }

      // if (isDefined(workspacePublicData)) {
      //   url.searchParams.set('workspaceId', workspacePublicData.id);
      // }
      return url.toString();
    },
    // [workspacePublicData],
  );

  const handleGoogleLogin = useCallback(
    (
      params: {
      // workspacePersonalInviteToken?: string;
      workspaceInviteToken?: string;
      // billingCheckoutSession?: BillingCheckoutSession;
    }
    ) => {
      redirect(buildRedirectUrl('/google/auth', params));
    },
    [buildRedirectUrl, redirect],
  );

  return {
    signInWithGoogle: handleGoogleLogin,
  };
}