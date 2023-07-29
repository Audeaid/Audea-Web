'use client'

import client from '@/utils/graphql'
import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'

export function ApolloNextClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isAppleDevice = /Mac|iPhone|iPad|iPod|Macintosh|Apple/i.test(navigator.userAgent)

    const manifestTag = document.querySelector('link[rel="manifest"]') as HTMLLinkElement

    if (!isAppleDevice) {
      manifestTag.href = '/manifest.json'
    }
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
