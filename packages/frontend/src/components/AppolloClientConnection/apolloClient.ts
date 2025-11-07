import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  fromPromise,
  from} from "@apollo/client";
  import { onError } from "@apollo/client/link/error";
import { cookieStorage } from '@src/utils/cookie-storage';
import { tokenPairState } from '@src/modules/auth/states/tokenPairState';
import { isDefined } from '@src/utils/validation/isDefined';
import { VITE_BACKEND_URL } from '@src/config';
import { loaderSignal } from "@src/modules/loader/loaderSignal";
import { renewToken } from '@src/modules/auth/services/authService';
import {
  snapshot_UNSTABLE,
  useGotoRecoilSnapshot,
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';


const graphURI = `${VITE_BACKEND_URL}/graphql`;

const httpLink = new HttpLink({
  uri: graphURI,
});

const authLink = new ApolloLink((operation, forward) => {
  const tokenPair = cookieStorage.getItem('tokenPair')

  const accessToken = tokenPair ? JSON.parse(tokenPair).accessToken : false;
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: accessToken ? `Bearer ${accessToken.token}` : '',
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

  const handleTokenRenewal = (
    operation,
    forward,
  ) => {
    const tokenPair = cookieStorage.getItem('tokenPair')
    const refreshToken = tokenPair ? JSON.parse(tokenPair) : false;
    
    return fromPromise(
      renewToken(graphURI, refreshToken )
        .then((tokens) => {
          if (isDefined(tokens)) {
            cookieStorage.setItem('tokenPair', JSON.stringify(tokens));
          }
        })
        .catch(() => {
        }),
    ).flatMap(() => forward(operation));
  };

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, forward, operation }) => {
  loaderSignal.stop();
  if (graphQLErrors) console.error("GraphQL Errors:", graphQLErrors);
  if (networkError) console.error("Network Error:", networkError);
  if (isDefined(networkError)) {
    return handleTokenRenewal(operation, forward);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, loaderLink, httpLink]),
  cache: new InMemoryCache(), 
});
export default client;