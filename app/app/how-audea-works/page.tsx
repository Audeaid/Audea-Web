import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Client from './lib';

export default function Page() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  return <Client />;
}
