import { getOneContent } from './graphql';
import Client from './lib';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  const token = signJwt(clerkUserId);

  try {
    const content = await getOneContent(token, id);
    return <Client content={content} token={token} id={id} />;
  } catch (error) {
    redirect('/');
  }
}
