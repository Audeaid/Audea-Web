import { redirect } from 'next/navigation';
import {
  IGetContentSettings,
  createNewContentSettings,
  getContentSettings,
} from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';
import { generateUrl } from '@/utils/url';
import { Suspense } from 'react';
import LoadingPage from '@/components/LoadingPage';

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) return redirect('/login');

    const token = signJwt(clerkUserId);

    const response = await getContentSettings(token);

    let contentSettings: IGetContentSettings;

    if (!response) {
      contentSettings = await createNewContentSettings(token);
    } else {
      contentSettings = response;
    }

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client contentSettings={contentSettings} token={token} />
      </Suspense>
    );
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        '/app/settings'
      )}`
    );
    return redirect(url.href);
  }
}
