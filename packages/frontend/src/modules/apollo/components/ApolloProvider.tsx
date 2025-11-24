import { ApolloProvider as ApolloProviderBase } from '@apollo/client';

import { useApolloFactory } from '@src/modules/apollo/hooks/useApolloFactory';
import { VITE_BACKEND_URL } from '@src/config';

export const ApolloProvider = ({ children }: React.PropsWithChildren) => {

  const apolloClient = useApolloFactory({
    uri: `${VITE_BACKEND_URL}/graphql`,
    connectToDevTools: true, // should this be default , ie dependant on IS_DEBUG_MODE?
  });
  window.__APOLLO_CLIENT__ = apolloClient;

  return (
    <ApolloProviderBase client={apolloClient}>{children}</ApolloProviderBase>
  );
};
