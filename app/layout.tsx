import '$styles/globals.css';
import { Inter } from 'next/font/google';
import { ApolloNextClient } from './apollo';
import { ClerkProvider } from '@clerk/nextjs';
import { ViewportProvider } from '@/context/Viewport';
import { DarkModeProvider } from '@/context/DarkMode';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Audea',
  description: 'Audea Web-App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <ApolloNextClient>
        {/* Our custom provider */}
        <ViewportProvider>
          <DarkModeProvider>
            <html lang="en">
              <body className={inter.className}>
                {children}

                <Script
                  src="//code.tidio.co/qaqhmzyxhfsct6xkbaxicly6mv91mxsq.js"
                  async
                />
                <Script src="/tidioChat.js" async />
              </body>
            </html>
          </DarkModeProvider>
        </ViewportProvider>
      </ApolloNextClient>
    </ClerkProvider>
  );
}
