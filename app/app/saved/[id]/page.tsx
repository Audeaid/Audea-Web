import { getOneContent } from './graphql';
import Client from './lib';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';
import { Suspense } from 'react';
import LoadingPage from '@/components/LoadingPage';
import { generateUrl } from '@/utils/url';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) return redirect('/login');

    const token = signJwt(clerkUserId);

    const content = await getOneContent(token, id);

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client content={content} token={token} id={id} />
      </Suspense>
    );
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/app/saved/${id}`
      )}`
    );
    return redirect(url.href);
  }
}
