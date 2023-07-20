import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'https://audea-server-production.up.railway.app/graphql'
      : 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

export default client;
