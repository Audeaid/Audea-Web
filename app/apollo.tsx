'use client'

import client from '@/utils/graphql'
import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'

export function ApolloNextClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isAppleDevice = /Mac|iPhone|iPad|iPod|Macintosh|Apple/i.test(navigator.userAgent)
    const isIPhoneOrIPad = isAppleDevice && navigator.maxTouchPoints > 0

    const manifestTag = document.querySelector('link[rel="manifest"]') as HTMLLinkElement

    if (isAppleDevice) {
      manifestTag.href = '/manifest-apple.json'
    }

    if (isIPhoneOrIPad) {
      manifestTag.href = '/manifest-ios.json'
    }
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
