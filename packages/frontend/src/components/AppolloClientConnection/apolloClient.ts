
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { cookieStorage } from 'src/utils/cookie-storage';
import { useParams } from 'react-router-dom';

const httpLink = createHttpLink({

  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,  // Replace with your NestJS GraphQL endpoint
});

const authLink = setContext((_, { headers }) => {
  const accessToken = cookieStorage.getItem('accessToken')

  let workspaceId = '';
  const path = window.location.pathname;
  const segments = path.split('/');
  if(segments.length > 2 && segments[1] === 'w'){
    workspaceId = segments[2];
  }

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