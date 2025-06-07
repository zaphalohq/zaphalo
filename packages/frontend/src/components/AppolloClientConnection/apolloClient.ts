
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from '../utils/localStorage';
import { cookieStorage } from 'src/utils/cookie-storage';


// Define the link to your GraphQL server
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,  // Replace with your NestJS GraphQL endpoint
});

// Use setContext to attach the JWT token to headers
const authLink = setContext((_, { headers }) => {
  // Retrieve token from localStorage or cookies
  const access_token = cookieStorage.getItem('accessToken')


  const workspaceId = sessionStorage.getItem("workspaceId");
  // Return the headers with Authorization token
  return {
    headers: {
      ...headers,
      Authorization: access_token ? `Bearer ${JSON.parse(access_token)}` : '',  // Attach JWT in Authorization header
      'x-workspace-id': workspaceId || '',
    }
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),  // Combine authLink with httpLink
  cache: new InMemoryCache(),       // Enable client-side caching
});
export default client;