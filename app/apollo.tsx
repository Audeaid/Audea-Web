'use client'

import client from '@/utils/graphql'
import { ApolloProvider } from '@apollo/client'

export function ApolloNextClient({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
