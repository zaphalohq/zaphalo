
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from '../utils/localStorage';


const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,
  // uri: 'http://192.168.1.2:3000/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = getItem('access_token'); 
  const workspaceId = sessionStorage.getItem("workspaceId");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',  
      'x-workspace-id': workspaceId || '',
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), 
  cache: new InMemoryCache(), 
});
export default client;