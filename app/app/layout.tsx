import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Navbar from './Navbar';
import Toast from './Toast';
import { signJwt } from '@/utils/jwt';
import { Suspense } from 'react';
import LoadingPage from '@/components/LoadingPage';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  const token = signJwt(clerkUserId);

  return (
    <main className="min-w-screen min-h-screen overflow-x-hidden">
      <Navbar token={token as string} />

      <Suspense fallback={<LoadingPage />}>
        <section className="md:mt-14 mt-20 pb-20 sm:px-10 px-4 max-w-[1300px] mx-auto w-full">
          {children}
        </section>
      </Suspense>

      <Toast />
    </main>
  );
}
