
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getItem } from '../utils/localStorage';


// Define the link to your GraphQL server
const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_BACKEND_URL}/graphql`,  // Replace with your NestJS GraphQL endpoint
  // uri: 'http://192.168.1.2:3000/graphql'
});

// Use setContext to attach the JWT token to headers
const authLink = setContext((_, { headers }) => {
  // Retrieve token from localStorage or cookies
  const token = getItem('access_token');  // or from cookies if you're using them
  const workspaceId = sessionStorage.getItem("workspaceId");
  // Return the headers with Authorization token
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',  // Attach JWT in Authorization header
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