'use client'

import client from '@/utils/graphql'
import { ApolloProvider } from '@apollo/client'
import { useLayoutEffect } from 'react'

export function ApolloNextClient({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const isAppleDevice = /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent)

    const manifestTag = document.querySelector('link[rel="manifest"]') as HTMLLinkElement

    if (!manifestTag) return

    if (isAppleDevice) {
      manifestTag.href = '/manifest-apple.json'
    }
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
