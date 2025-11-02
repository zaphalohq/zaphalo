import { ApolloClient, InMemoryCache, ApolloLink, HttpLink, from } from "@apollo/client";import { onError } from "@apollo/client/link/error";
import { cookieStorage } from '@src/utils/cookie-storage';
import { VITE_BACKEND_URL } from '@src/config';
import { loaderSignal } from "@src/modules/loader/loaderSignal";

const httpLink = new HttpLink({
  uri: `${VITE_BACKEND_URL}/graphql`,
});

const authLink = new ApolloLink((operation, forward) => {
  const tokenPair = cookieStorage.getItem('tokenPair')
  let workspaceId = '';
  const path = window.location.pathname;
  const segments = path.split('/');
  if(segments.length > 2 && segments[1] === 'w'){
    workspaceId = segments[2];
  }

  const accessToken = tokenPair ? JSON.parse(tokenPair).accessToken : false;
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken.token}` : '',
        'x-workspace-id': workspaceId || '',
      },
    });
  }
  return forward(operation);
});

const loaderLink = new ApolloLink((operation, forward) => {
  loaderSignal.start();
  return forward(operation).map((result) => {
    loaderSignal.stop();
    return result;
  });
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  loaderSignal.stop();
  if (graphQLErrors) console.error("GraphQL Errors:", graphQLErrors);
  if (networkError) console.error("Network Error:", networkError);
});

const client = new ApolloClient({
  link: from([errorLink, authLink, loaderLink, httpLink]),
  cache: new InMemoryCache(), 
});
export default client;