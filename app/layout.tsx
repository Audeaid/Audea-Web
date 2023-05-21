import '$styles/globals.css';
import { Inter } from 'next/font/google';
import { ApolloNextClient } from './apollo';

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
    <ApolloNextClient>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ApolloNextClient>
  );
}
