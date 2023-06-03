'use client';

import { Toaster } from 'react-hot-toast';
import LeftSection from './LeftSection';
import Header from './Header';
import Sequence from './Sequence';
import { useRouter } from 'next/navigation';

export default function Client() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex">
      <LeftSection />

      <section className="w-full min-h-screen flex flex-col gap-10 relative">
        <Header />

        <Sequence router={router} />

        <Toaster
          position="bottom-center"
          containerStyle={{ position: 'absolute' }}
        />
      </section>
    </main>
  );
}
