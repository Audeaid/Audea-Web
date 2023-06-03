import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export default function Page() {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (token) redirect('/app');

  return <Client />;
}
