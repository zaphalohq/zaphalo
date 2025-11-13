import { ApolloProvider as ApolloProviderBase } from '@apollo/client';

import { useApolloFactory } from '@src/modules/apollo/hooks/useApolloFactory';
// import { createCaptchaRefreshLink } from '@/apollo/utils/captchaRefreshLink';
// import { useRequestFreshCaptchaToken } from '@/captcha/hooks/useRequestFreshCaptchaToken';
import { VITE_BACKEND_URL } from '@src/config';

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {
  // const { requestFreshCaptchaToken } = useRequestFreshCaptchaToken();

  // const captchaRefreshLink = createCaptchaRefreshLink(requestFreshCaptchaToken);

  const apolloClient = useApolloFactory({
    uri: `${VITE_BACKEND_URL}/graphql`,
    connectToDevTools: true, // should this be default , ie dependant on IS_DEBUG_MODE?
    // extraLinks: [captchaRefreshLink],
  });
  // This will attach the right apollo client to Apollo Dev Tools
  window.__APOLLO_CLIENT__ = apolloClient;

  return (
    <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
  );
};
