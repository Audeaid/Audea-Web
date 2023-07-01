'use client';

import {
  createNewContentSettings,
  createNewUserSubscriptionTrial,
  createUserFromClerk,
  sendNewUserEmail,
} from '@/app/signup/[[...signup]]/lib/Sequence/FifthSequence/script';
import AddLottieAnimation from '@/components/AddLottieAnimation';
import { signJwtClient } from '@/utils/jwt';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { deleteUserMutation } from './deleteUserMutation';
import axios from 'axios';

export default function CreatingNewUser({
  email,
  clerkId,
  firstName,
  lastName,
  referralJwt,
}: {
  email: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  referralJwt: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);

  const [userDbId, setUserDbId] = useState<string | null>(null);

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

        setUserDbId(response.id);

        const token = signJwtClient(response.clerkUserId);

        await createNewUserSubscriptionTrial(token);

        await createNewContentSettings(token);

        // Run sendNewUserEmail query
        await sendNewUserEmail({ email, name: firstName });

        setLoading(false);
        setSuccess(true);

        setTimeout(() => {
          router.push('/app');
        }, 2000);
      } catch (error) {
        console.error(error);

        setLoading(false);
        setSuccess(false);

        await axios.post('/api/deleteClerkUser', { clerkUserId: clerkId });

        if (userDbId) {
          await deleteUserMutation(userDbId);
        }

        setTimeout(() => {
          router.push('/signup');
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
                <h3 className="text-xl text-center font-medium">
                  Success! Redirecting you to /app...
                </h3>
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
                  Error creating your account! Please try again!
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
}
