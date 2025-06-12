import { useParams, useSearchParams } from 'react-router-dom';

import { useAuth } from '@src/modules/auth/hooks/useAuth';
// import { BillingCheckoutSession } from '@/auth/types/billingCheckoutSession.type';

export const useVerifyLoginToken = () => {
  // const { enqueueSnackBar } = useSnackBar();
  // const navigate = useNavigateApp();
  const { getAuthTokensFromLoginToken } = useAuth();
  // const { t } = useLingui();

  const verifyLoginToken = async (loginToken: string) => {
    try {
      await getAuthTokensFromLoginToken(loginToken);
    } catch (error) {
      console.log("..............error..............", error);
      // enqueueSnackBar(t`Authentication failed`, {
      //   variant: SnackBarVariant.Error,
      // });
      // navigate(AppPath.SignInUp);
    }
  };

  return { verifyLoginToken };
};

