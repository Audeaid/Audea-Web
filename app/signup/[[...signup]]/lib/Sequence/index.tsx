'use client';

import { useState } from 'react';
import FirstSequence from './FirstSequence';
import SecondSequence from './SecondSequence';
import ThirdSequence from './ThirdSequence';
import FourthSequence from './FourthSequence';
import FifthSequence from './FifthSequence';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { useSignUp } from '@clerk/nextjs';
import toast from 'react-hot-toast';

const Sequence = ({ router }: { router: AppRouterInstance }) => {
  const [progress, setProgress] = useState(1);

  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [clerkId, setClerkId] = useState('');

  switch (progress) {
    case 1:
      return <FirstSequence setEmail={setEmail} setProgress={setProgress} />;

    case 2:
      return (
        <SecondSequence
          setPasswordForm={setPassword}
          setProgress={setProgress}
        />
      );

    case 3:
      return (
        <ThirdSequence
          setFirstName={setFirstName}
          setLastName={setLastName}
          handleClerkSubmit={async (firstName, lastName) => {
            try {
              if (!isLoaded) {
                return;
              }

              await signUp.create({
                emailAddress: email,
                password,
                firstName,
                lastName,
              });

              // send the email.
              toast
                .promise(
                  signUp.prepareEmailAddressVerification({
                    strategy: 'email_code',
                  }),
                  {
                    loading: 'Sending OTP...',
                    success: 'Success sending OTP!',
                    error: 'Error sending OTP!',
                  }
                )
                .then(() => {
                  setProgress(4);
                });
            } catch (error) {
              console.error(error);
              console.log(JSON.stringify(error));
            }
          }}
        />
      );

    case 4:
      return (
        <FourthSequence
          email={email}
          handleClerkSubmit={async (otpCode) => {
            if (!isLoaded) {
              return;
            }

            try {
              toast.loading('OTP Verification...', { duration: 2000 });
              const completeSignUp =
                await signUp.attemptEmailAddressVerification({
                  code: otpCode,
                });
              if (completeSignUp.status !== 'complete') {
                /*  investigate the response, to see if there was an error
                 or if the user needs to complete more steps.*/
                console.log(JSON.stringify(completeSignUp, null, 2));
              }
              if (completeSignUp.status === 'complete') {
                toast.success('Success verifying your OTP!');
                if (!signUp.createdUserId)
                  throw new Error('clerkId is undefined');

                setClerkId(signUp.createdUserId);

                setProgress(5);
              }
            } catch (err: any) {
              toast.error('Error verifying your OTP!');
              console.error(JSON.stringify(err, null, 2));
            }
          }}
        />
      );

    case 5:
      return (
        <FifthSequence
          email={email}
          clerkId={clerkId}
          firstName={firstName}
          lastName={lastName}
          router={router}
          handleClerk={async () => {
            if (!isLoaded) {
              return;
            }

            await setActive({ session: signUp.createdSessionId });
          }}
        />
      );

    default:
      return <></>;
  }
};

export default Sequence;
