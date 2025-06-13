
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from '../utils/localStorage';
import { cookieStorage } from 'src/utils/cookie-storage';


const httpLink = createHttpLink({

  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,  // Replace with your NestJS GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {

  // Retrieve token from localStorage or cookies
  const accessToken = cookieStorage.getItem('accessToken')

  const workspaceId = sessionStorage.getItem("workspaceId");
  const authtoken = accessToken ? JSON.parse(accessToken).accessToken : false;

  return {
    headers: {
      ...headers,

      Authorization: authtoken ? `Bearer ${authtoken.token}` : '',  // Attach JWT in Authorization header
      'x-workspace-id': workspaceId || '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(), 
});
export default client;