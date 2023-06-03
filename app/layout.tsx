import '$styles/globals.css';
import { Inter } from 'next/font/google';
import { ApolloNextClient } from './apollo';
import { ClerkProvider } from '@clerk/nextjs';

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
        <html lang="en">
          <body className={inter.className}>{children}</body>
        </html>
      </ApolloNextClient>
    </ClerkProvider>
  );
}
