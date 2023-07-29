'use client'

import client from '@/utils/graphql'
import { ApolloProvider } from '@apollo/client'
import { useEffect } from 'react'

export function ApolloNextClient({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isAppleDevice = /Mac|iPhone|iPad|iPod|Macintosh|Apple/i.test(navigator.userAgent)
    const isIPhoneOrIPad = isAppleDevice && navigator.maxTouchPoints > 0

    const manifestLink = document.createElement('link')
    manifestLink.rel = 'manifest'

    if (isAppleDevice) {
      manifestLink.href = '/manifest-apple.json'
    } else if (isIPhoneOrIPad) {
      manifestLink.href = '/manifest-ios.json'
    } else {
      manifestLink.href = '/manifest.json'
    }

    document.head.appendChild(manifestLink)
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
