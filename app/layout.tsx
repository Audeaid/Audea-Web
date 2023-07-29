import '@/styles/globals.css'
import '@/styles/animation.css'
import { Inter } from 'next/font/google'
import { ApolloNextClient } from '@/app/apollo'
import { ClerkProvider } from '@clerk/nextjs'
import { ViewportProvider } from '@/context/Viewport'
import { DarkModeProvider } from '@/context/DarkMode'
import { Metadata } from 'next'
import meta from '@/app/meta'
import GTag from './gtag'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = meta

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ApolloNextClient>
        <ViewportProvider>
          <DarkModeProvider>
            <html lang='en' suppressHydrationWarning={true} suppressContentEditableWarning={true}>
              <body className={inter.className}>{children}</body>

              <GTag />
            </html>
          </DarkModeProvider>
        </ViewportProvider>
      </ApolloNextClient>
    </ClerkProvider>
  )
}
