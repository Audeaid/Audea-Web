'use client';

import LogoSecondary from '$public/logo/secondary.svg';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Progress1, Progress2, Progress3, Progress4 } from './progress';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ForgotClient({ token }: { token: string }) {
  const router = useRouter();
  const decodedToken = decodeURIComponent(token);
  const [progress, setProgress] = useState(1);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jwtToken, setJwtToken] = useState('');

  return (
    <main className="min-h-screen flex flex-col gap-10">
      <motion.nav
        className="w-full h-fit sm:px-20 sm:py-10 px-4 py-6 flex sm:flex-row flex-col justify-between items-center select-none gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <a href="/">
          <Image
            src={LogoSecondary}
            alt="Audea Logo"
            width={120}
            quality={100}
            draggable={false}
          />
        </a>

        <section className="font-medium flex items-center justify-center w-fit h-fit gap-2">
          <p>Not meant to reset your password? </p>

          <a href="/login">
            <button className="text-primaryDark flex items-center justify-center text-base gap-1">
              Login
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </a>
        </section>
      </motion.nav>

      <section className="flex flex-col gap-8 mx-auto sm:px-0 px-4 pb-10 max-w-[400px] w-full">
        <motion.h1
          className="text-3xl font-bold text-left select-none w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Reset your password
        </motion.h1>

        <section className="w-full h-fit">
          {(() => {
            switch (progress) {
              case 1:
                return (
                  <Progress1
                    setEmail={setEmail}
                    token={decodedToken}
                    handleVerified={() => {
                      setTimeout(() => {
                        setProgress(2);
                      }, 1000);
                    }}
                  />
                );

              case 2:
                return (
                  <Progress2
                    email={email}
                    setJwtToken={setJwtToken}
                    handleVerified={() => {
                      setTimeout(() => {
                        setProgress(3);
                      }, 1000);
                    }}
                  />
                );

              case 3:
                return (
                  <Progress3
                    handleSubmit={(e) => {
                      e.preventDefault();

                      setProgress(4);
                    }}
                    setPassword={setPassword}
                  />
                );

              case 4:
                return (
                  <Progress4
                    email={email}
                    password={password}
                    jwtToken={jwtToken}
                    router={router}
                  />
                );

              default:
                return <></>;
            }
          })()}
        </section>
      </section>

      <Toaster position="bottom-center" />
    </main>
  );
}
