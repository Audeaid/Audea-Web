import { getAllContent } from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export interface AuthTokenPayload {
  userId: string;
}

export default async function Page() {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (!token) throw new Error('Token is null');

  const content = await getAllContent(token);

  return <Client incomingContent={content} clerkUserId={clerkUserId} />;
}
