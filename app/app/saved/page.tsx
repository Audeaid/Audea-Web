import { redirect } from 'next/navigation';
import { getAllContent } from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';

export default async function Page() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  const token = signJwt(clerkUserId);

  const content = await getAllContent(token);

  return <Client incomingContent={content} clerkUserId={clerkUserId} />;
}
