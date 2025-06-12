
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from '../utils/localStorage';
import { cookieStorage } from 'src/utils/cookie-storage';


const httpLink = createHttpLink({

  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,  // Replace with your NestJS GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {

  // Retrieve token from localStorage or cookies
  const access_token = cookieStorage.getItem('accessToken')

  const workspaceId = sessionStorage.getItem("workspaceId");
  return {
    headers: {
      ...headers,

      Authorization: access_token ? `Bearer ${JSON.parse(access_token)}` : '',  // Attach JWT in Authorization header
      'x-workspace-id': workspaceId || '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(), 
});
export default client;