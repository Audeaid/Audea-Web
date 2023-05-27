'use client';

import { motion } from 'framer-motion';
import Header from './Header';
import SocialLogin from './SocialLogin';
import LoginForm from './LoginForm';
import { useRouter } from 'next/navigation';
import FooterText from './FooterText';

export default function Client() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex flex-col gap-10">
      <Header />

      <motion.section
        className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="sm:text-6xl text-4xl font-bold text-center select-none">
          Login
        </h1>

        <section className="flex flex-col gap-8">
          <SocialLogin />

          <p className="text-center text-primaryDark select-none">Or</p>

          <LoginForm router={router} />

          <FooterText />
        </section>
      </motion.section>
    </main>
  );
}
