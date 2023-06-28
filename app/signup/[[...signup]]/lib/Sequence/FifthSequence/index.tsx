'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AddLottieAnimation from '$components/AddLottieAnimation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import {
  createNewContentSettings,
  createNewUserSubscriptionTrial,
  createUserFromClerk,
  sendNewUserEmail,
} from './script';
import { signJwtClient } from '@/utils/jwt';

const FifthSequence = ({
  email,
  clerkId,
  firstName,
  lastName,
  router,
  handleClerk,
  referralJwt,
}: {
  email: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  router: AppRouterInstance;
  handleClerk: () => void;
  referralJwt: string | null;
}) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const response = await createUserFromClerk({
          email,
          clerkId,
          firstName,
          lastName,
          referralJwt,
        });

        const token = signJwtClient(response.clerkUserId);

        await createNewUserSubscriptionTrial(token);
        await createNewContentSettings(token);

        // Run sendNewUserEmail query
        await sendNewUserEmail({ email, name: firstName });

        setLoading(false);
        setSuccess(true);

        handleClerk();

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
      className="max-w-[400px] flex flex-col gap-8 mx-auto sm:px-0 px-4 pb-10 items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(() => {
        if (loading) {
          return (
            <>
              <div className="w-fit h-fit max-w-[300px] max-h-[200px]">
                <AddLottieAnimation
                  path="/lottie/9844-loading-40-paperplane.json"
                  loop={true}
                />
              </div>
              <h3 className="text-xl text-center font-medium">
                Creating your account...
              </h3>
            </>
          );
        } else {
          if (success === true) {
            return (
              <>
                <div className="w-fit h-fit max-w-[300px] max-h-[200px]">
                  <AddLottieAnimation
                    path="/lottie/96237-success.json"
                    loop={false}
                  />
                </div>
                <h3 className="text-xl text-center font-medium">Success!</h3>
              </>
            );
          } else if (success === false) {
            return (
              <>
                <div className="w-fit h-fit max-w-[200px] max-h-[200px]">
                  <AddLottieAnimation
                    path="/lottie/91878-bouncy-fail.json"
                    loop={false}
                  />
                </div>
                <h3 className="text-xl text-center font-medium">
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

export default FifthSequence;
