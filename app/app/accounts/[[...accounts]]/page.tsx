import { auth } from '@clerk/nextjs';
import './styles.css';
import { redirect } from 'next/navigation';
import Client from './client';
import { generateUrl } from '@/utils/url';
import { Suspense } from 'react';
import LoadingPage from '@/components/LoadingPage';

export default function Page({ params }: { params: { accounts: string } }) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) return redirect('/login');

    return (
      <section className="w-fit h-fit flex items-center justify-start mx-auto text-foreground">
        <Suspense fallback={<LoadingPage />}>
          <Client />
        </Suspense>
      </section>
    );
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/app/accounts/${params.accounts ? params.accounts[0] : ''}`
      )}`
    );
    return redirect(url.href);
  }
}
