'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AddLottieAnimation from '$components/AddLottieAnimation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import cookieCutter from 'cookie-cutter';
import { changePassword } from './script';

const FourthSequence = ({
  email,
  password,
  jwtToken,
  router,
}: {
  email: string;
  password: string;
  jwtToken: string;
  router: AppRouterInstance;
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await changePassword({
          email,
          password,
          jwtToken,
        });

        cookieCutter.set('audea_token', response.token);
        cookieCutter.set('audea_signInProvider', 'PASSWORD');

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
          router.push('/app');
        }, 2000);
      } catch (error) {
        console.error(error);

        setLoading(false);
        setSuccess(false);

        setTimeout(() => {
          router.push('/');
        }, 5000);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      className="max-w-[400px] flex flex-col gap-0 mx-auto sm:px-0 px-4 pb-10 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(() => {
        if (loading) {
          return (
            <>
              <div className="w-fit h-fit max-w-[400px] max-h-[300px]">
                <AddLottieAnimation
                  path="/lottie/9844-loading-40-paperplane.json"
                  loop={true}
                />
              </div>
              <h3 className="sm:text-3xl text-2xl text-center font-medium">
                Changing your password...
              </h3>
            </>
          );
        } else {
          if (success === true) {
            return (
              <>
                <div className="w-fit h-fit max-w-[400px] max-h-[300px]">
                  <AddLottieAnimation
                    path="/lottie/96237-success.json"
                    loop={false}
                  />
                </div>
                <h3 className="sm:text-3xl text-2xl text-center font-medium">
                  Success!
                </h3>
              </>
            );
          } else if (success === false) {
            return (
              <>
                <div className="w-fit h-fit max-w-[300px] max-h-[300px]">
                  <AddLottieAnimation
                    path="/lottie/91878-bouncy-fail.json"
                    loop={false}
                  />
                </div>
                <h3 className="sm:text-3xl text-2xl text-center font-medium">
                  Error connecting to the server!
                </h3>
              </>
            );
          } else {
            return <></>;
          }
        }
      })()}
    </motion.section>
  );
};

export default FourthSequence;
