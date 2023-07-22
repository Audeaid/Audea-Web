import { ApolloClient, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'
import WebSocket from 'isomorphic-ws'

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://audea-server-production.up.railway.app/graphql'
    : 'http://localhost:8080/graphql'

const wsUrl =
  process.env.NODE_ENV === 'production'
    ? 'wss://audea-server-production.up.railway.app/graphql'
    : 'ws://localhost:8080/graphql'

export const middleware = new ApolloClient({
  uri: url,
  cache: new InMemoryCache(),
})

const client = new ApolloClient({
  link: setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
      },
    }
  }).concat(
    split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
      },

      (() => {
        return new GraphQLWsLink(
          createClient({
            url: wsUrl,
            webSocketImpl: WebSocket,
          }),
        )
      })(),

      createHttpLink({
        uri: url,
      }),
    ),
  ),

  cache: new InMemoryCache(),
})

export default client
