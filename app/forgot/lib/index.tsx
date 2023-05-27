'use client';

import { Toaster } from 'react-hot-toast';
import Header from './Header';
import { motion } from 'framer-motion';
import Sequence from './Sequence';
import { useRouter } from 'next/navigation';

export default function Client({ token }: { token: string }) {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col gap-10">
      <Header />

      <section className="flex flex-col gap-8 mx-auto sm:px-0 px-4 pb-10 max-w-[400px] w-full">
        <motion.h1
          className="text-3xl font-bold text-left select-none w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Reset your password
        </motion.h1>

        <section className="w-full h-fit">
          <Sequence token={token} router={router} />
        </section>
      </section>

      <Toaster position="bottom-center" />
    </main>
  );
}
