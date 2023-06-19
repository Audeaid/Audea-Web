import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Client from './lib';
import { generateUrl } from '@/utils/url';

export default function Page() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) redirect('/login');

    return <Client />;
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        '/app/how-audea-works'
      )}`
    );
    return redirect(url.href);
  }
}
