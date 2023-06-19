'use client';

import Image from 'next/image';
import AudeaImage from '@/public/logo/secondary.svg';
import AudeaImageTwo from '@/public/logo/logo_text_black.svg';
import Link from 'next/link';
import cn from '@/utils/cn';
import { buttonVariants } from '@/components/ui/button';
import { useSignIn } from '@clerk/nextjs';
import { useContext, useState } from 'react';
import { DarkModeContext } from '@/context/DarkMode';
import { motion } from 'framer-motion';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import FirstSequence from './FirstSequence';
import type { SignInFirstFactor, SignInResource } from '@clerk/types';
import ChooseFirstFactor from './ChooseFirstFactor';
import EmailCode from './EmailCode';
import { toast } from 'react-hot-toast';
import Toast from '@/app/app/Toast';
import { useRouter } from 'next/navigation';
import Password from './Password';
import ForgotPassword from './ForgotPassword';

export default function Client() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();
  const darkMode = useContext(DarkModeContext);
  const [progress, setProgress] = useState('initial');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [firstFactors, setFirstFactors] = useState<SignInFirstFactor[]>([]);

  const [signInData, setSignInData] = useState<SignInResource>(
    {} as SignInResource
  );

  if (!isLoaded) {
    return <></>;
  }

  return (
    <motion.main
      className="min-w-screen min-h-screen select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="w-full h-fit flex justify-between items-center md:px-8 px-4 md:py-8 py-4">
        <div className="w-fit h-fit px-3">
          <Image
            src={darkMode?.darkMode ? AudeaImage : AudeaImageTwo}
            alt="Audea logo"
            draggable={false}
            quality={100}
            height={22}
          />
        </div>
        <Link
          href="/signup"
          className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
        >
          Sign up
        </Link>
      </header>

      <div className="w-full h-fit mt-10 sm:px-0 px-2 pb-20">
        <Card className={cn('w-fit h-fit mx-auto max-w-[400px]')}>
          <CardHeader>
            <CardTitle>
              <div className="flex flex-col space-y-2 text-left">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Sign in
                </h1>
              </div>
            </CardTitle>
            <CardDescription className={cn('text-left')}>
              To continue to Audea
            </CardDescription>
          </CardHeader>

          {(() => {
            switch (progress) {
              case 'initial':
                return (
                  <FirstSequence
                    onSubmit={async (e) => {
                      e.preventDefault();

                      const formData = new FormData(e.currentTarget);
                      const emailForm = formData.get('email');

                      if (!emailForm) {
                        return;
                      }

                      try {
                        setLoading(true);
                        setErrorMsg(null);

                        const data = await signIn.create({
                          identifier: emailForm.toString(),
                        });

                        setSignInData(data);

                        const firstFactor = data.supportedFirstFactors
                          .filter(
                            ({ strategy }) =>
                              strategy !== 'reset_password_email_code'
                          )
                          .sort((valA, valB) => {
                            const a = valA as any;
                            const b = valB as any;

                            if (a.primary) {
                              return -1; // Move a to the top
                            } else if (b.primary) {
                              return 1; // Move b to the top
                            } else {
                              return 0; // Maintain the original order
                            }
                          });

                        setLoading(false);

                        setEmail(emailForm.toString());
                        setFirstFactors(firstFactor);
                        setProgress('choose-first-factor');
                      } catch (error) {
                        setLoading(false);
                        const e = JSON.stringify(error);
                        const err = JSON.parse(e);

                        if (
                          err &&
                          // eslint-disable-next-line no-prototype-builtins
                          err.hasOwnProperty('clerkError') &&
                          // eslint-disable-next-line no-prototype-builtins
                          err.hasOwnProperty('errors') &&
                          err.errors.length > 0
                        ) {
                          setErrorMsg(err.errors[0].longMessage);
                        }
                      }
                    }}
                    loading={loading}
                    errorMsg={errorMsg}
                  />
                );

              case 'choose-first-factor':
                return (
                  <ChooseFirstFactor
                    email={email}
                    firstFactors={firstFactors}
                    handleEditEmail={() => setProgress('initial')}
                    handleEmailCode={async () => {
                      setProgress('email-code');

                      toast.promise(
                        (async () => {
                          try {
                            const emailFirstFactor = firstFactors.find(
                              ({ strategy }) => {
                                return strategy === 'email_code';
                              }
                            );

                            const { emailAddressId } = emailFirstFactor as any;

                            await signInData.prepareFirstFactor({
                              strategy: 'email_code',
                              emailAddressId,
                            });
                          } catch (error) {
                            console.log(JSON.parse(JSON.stringify(error)));
                          }
                        })(),
                        {
                          loading: 'Sending one-time code...',
                          success: 'One-time code sent!',
                          error: 'Error sending one-time code!',
                        }
                      );
                    }}
                    handlePassword={() => setProgress('password')}
                    handleGoogle={() => {
                      signInData.authenticateWithRedirect({
                        strategy: 'oauth_google',
                        redirectUrl: '/login/sso-callback',
                        redirectUrlComplete: '/login/check-user',
                      });
                    }}
                  />
                );

              case 'email-code':
                return (
                  <EmailCode
                    email={email}
                    handleSubmit={async (e) => {
                      e.preventDefault();

                      const formData = new FormData(e.currentTarget);

                      let otpArr: string[] = [];

                      for (let i = 0; i < 6; i++) {
                        const otpForm = formData.get(`otp-${i}`);

                        if (otpForm) {
                          otpArr.push(otpForm.toString());
                        }
                      }
                      const code = otpArr.join('');

                      try {
                        setLoading(true);
                        setErrorMsg(null);

                        await signInData.attemptFirstFactor({
                          strategy: 'email_code',
                          code,
                        });

                        await setActive({
                          session: signInData.createdSessionId,
                        });

                        router.push('/app');

                        setLoading(false);
                      } catch (e) {
                        setLoading(false);
                        const error = JSON.parse(JSON.stringify(e));

                        if (
                          error &&
                          // eslint-disable-next-line no-prototype-builtins
                          error.hasOwnProperty('clerkError') &&
                          // eslint-disable-next-line no-prototype-builtins
                          error.hasOwnProperty('errors') &&
                          error.errors.length > 0
                        ) {
                          setErrorMsg(error.errors[0].longMessage);

                          setTimeout(() => {
                            if (
                              error.errors[0].code === 'verification_expired'
                            ) {
                              setErrorMsg(null);
                              setProgress('initial');
                            }
                          }, 2000);
                        }
                      }
                    }}
                    loading={loading}
                    errorMsg={errorMsg}
                    handleEditEmail={() => setProgress('initial')}
                  />
                );

              case 'password':
                return (
                  <Password
                    email={email}
                    handleSubmit={async (e) => {
                      e.preventDefault();

                      const formData = new FormData(e.currentTarget);
                      const passwordForm = formData.get('password');

                      if (!passwordForm) {
                        return;
                      }

                      try {
                        setLoading(true);
                        setErrorMsg(null);

                        const password = passwordForm.toString();

                        const result = await signIn.create({
                          identifier: email,
                          password,
                        });

                        if (result.status === 'complete') {
                          await setActive({ session: result.createdSessionId });
                          router.push('/app');
                        }

                        setLoading(false);
                      } catch (error) {
                        setLoading(false);
                        const e = JSON.stringify(error);
                        const err = JSON.parse(e);

                        if (
                          err &&
                          // eslint-disable-next-line no-prototype-builtins
                          err.hasOwnProperty('clerkError') &&
                          // eslint-disable-next-line no-prototype-builtins
                          err.hasOwnProperty('errors') &&
                          err.errors.length > 0
                        ) {
                          setErrorMsg(err.errors[0].longMessage);
                        }
                      }
                    }}
                    loading={loading}
                    errorMsg={errorMsg}
                    handleEditEmail={() => setProgress('initial')}
                    onForgotPassword={async () => {
                      setProgress('forgot-password');

                      toast.promise(
                        (async () => {
                          try {
                            await signIn.create({
                              strategy: 'reset_password_email_code',
                              identifier: email,
                            });
                          } catch (error) {
                            console.log(JSON.parse(JSON.stringify(error)));
                          }
                        })(),
                        {
                          loading: 'Sending one-time code...',
                          success: 'One-time code sent!',
                          error: 'Error sending one-time code!',
                        }
                      );
                    }}
                  />
                );

              case 'forgot-password':
                return (
                  <ForgotPassword
                    email={email}
                    handleSubmit={async (e) => {
                      e.preventDefault();

                      const formData = new FormData(e.currentTarget);

                      const passwordForm = formData.get('password');

                      if (!passwordForm) return;

                      let otpArr: string[] = [];

                      for (let i = 0; i < 6; i++) {
                        const otpForm = formData.get(`otp-${i}`);

                        if (otpForm) {
                          otpArr.push(otpForm.toString());
                        }
                      }

                      const code = otpArr.join('');
                      const password = passwordForm.toString();

                      try {
                        setLoading(true);
                        setErrorMsg(null);

                        const result = await signIn.attemptFirstFactor({
                          strategy: 'reset_password_email_code',
                          code,
                          password,
                        });

                        if (result.status === 'complete') {
                          await setActive({
                            session: signInData.createdSessionId,
                          });

                          router.push('/app');
                        }

                        setLoading(false);
                      } catch (e) {
                        setLoading(false);
                        const error = JSON.parse(JSON.stringify(e));

                        if (
                          error &&
                          // eslint-disable-next-line no-prototype-builtins
                          error.hasOwnProperty('clerkError') &&
                          // eslint-disable-next-line no-prototype-builtins
                          error.hasOwnProperty('errors') &&
                          error.errors.length > 0
                        ) {
                          setErrorMsg(error.errors[0].longMessage);

                          setTimeout(() => {
                            if (
                              error.errors[0].code === 'verification_expired'
                            ) {
                              setErrorMsg(null);
                              setProgress('initial');
                            }
                          }, 2000);
                        }
                      }
                    }}
                    loading={loading}
                    errorMsg={errorMsg}
                  />
                );

              default:
                return <></>;
            }
          })()}
        </Card>
      </div>

      <Toast />
    </motion.main>
  );
}
