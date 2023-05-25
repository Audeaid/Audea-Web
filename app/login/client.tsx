'use client';

import LogoSecondary from '$public/logo/secondary.svg';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import SocialMediaLogin from '$components/SocialMediaLogin';
import TextInput from '$components/TextInput';
import { useState } from 'react';
import { loginWithPassword, searchUserByEmail } from './helper';
import LoadingSpinner from '$components/LoadingSpinner';
import cookieCutter from 'cookie-cutter';
import { useRouter } from 'next/navigation';
import * as bcrypt from 'bcryptjs';

const socmedButton = [
  {
    type: 'google',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Google',
  },
  {
    type: 'apple',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Apple',
  },
  {
    type: 'microsoft',
    onClick: () => {},
    disabled: true,
    text: 'Continue with Microsoft',
  },
];

export default function LoginClient() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailIsPasswordRegistered, setEmailIsPasswordRegistered] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotHash, setForgotHash] = useState('');

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
          <p>Don&apos;t have an account? </p>

          <a href="/signup">
            <button className="text-primaryDark flex items-center justify-center text-base gap-1">
              Signup
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </a>
        </section>
      </motion.nav>

      <motion.section
        className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="sm:text-6xl text-4xl font-bold text-center select-none">
          Login
        </h1>
        <section className="flex flex-col gap-8">
          <section className="flex flex-col gap-3">
            {socmedButton.map(({ disabled, onClick, type, text }, index) => {
              return (
                <SocialMediaLogin
                  disabled={disabled}
                  onClick={onClick}
                  type={type as any}
                  key={index}
                >
                  {text}
                </SocialMediaLogin>
              );
            })}
          </section>

          <p className="text-center text-primaryDark select-none">Or</p>

          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const email = formData.get('email');
              const password = formData.get('password');

              // Check if email is registered
              if (password === null && email !== null) {
                setLoading(true);

                try {
                  const userData = await searchUserByEmail({
                    email: email.toString(),
                  });

                  const isEmailRegistered = userData !== null;

                  setLoading(false);

                  if (isEmailRegistered) {
                    const signInProvider = userData.signInProvider;

                    if (signInProvider !== 'PASSWORD') {
                      setErrorMsg('Please use your sign-in provider.');
                    } else {
                      setEmailIsPasswordRegistered(true);

                      const response = await bcrypt.hash(email.toString(), 10);
                      setForgotHash(response);
                    }
                  } else {
                    setErrorMsg(
                      'We could not reach the email address you provided. Please try again with a different email.'
                    );
                  }
                } catch (error) {
                  setLoading(false);
                  setErrorMsg(
                    "We could not reach Audea's server. Please try again in a few minutes."
                  );
                  console.error(error);
                }
              }

              // Sign-in with password
              if (password !== null && email !== null) {
                setLoading(true);

                const emailStr = email.toString();
                const passwordStr = password.toString();

                try {
                  const response = await loginWithPassword({
                    email: emailStr,
                    password: passwordStr,
                  });

                  cookieCutter.set('audea_token', response.token);
                  cookieCutter.set('audea_signInProvider', 'PASSWORD');

                  setLoading(false);

                  router.push('/app');
                } catch (error) {
                  setLoading(false);
                  setErrorMsg(
                    "We could not reach Audea's server. Please try again in a few minutes."
                  );

                  console.error(error);
                }
              }
            }}
          >
            <TextInput
              placeholder="Enter your email address..."
              textLabel="Email"
              id="email"
              type="email"
              name="email"
            />
            {emailIsPasswordRegistered && (
              <TextInput
                placeholder="Enter your password..."
                textLabel="Password"
                id="password"
                type="password"
                name="password"
              />
            )}

            <button
              className="bg-[#FDF5F2] text-sm w-full h-fit py-1.5 rounded border border-[#FAC6C4] text-[#EB5757] flex items-center justify-center"
              disabled={loading}
            >
              {loading && <LoadingSpinner size={4} />}
              Continue with email
            </button>
          </form>

          {emailIsPasswordRegistered && (
            <a
              href={`/forgot?token=${forgotHash}`}
              className="text-sm text-primaryDark text-center"
            >
              Forgot password?
            </a>
          )}

          {errorMsg && (
            <p className="text-xs text-justify text-errorDark">{errorMsg}</p>
          )}

          <p className="text-xs text-justify select-none">
            By clicking &quot;Continue with Apple / Google / Microsoft /
            Email&quot; above, you acknowledge that you have read and
            understood, and agree to Audea&apos;s{' '}
            <a
              href="https://audeaid.notion.site/Terms-of-Service-d0dcba2ccba54a9bb60b6c1dc0255c4f"
              className="text-primaryDark hover:text-errorDark"
              target="_blank"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://audeaid.notion.site/Privacy-Policy-f865747ed0e142fa92680408d91fe136"
              className="text-primaryDark hover:text-errorDark"
              target="_blank"
            >
              Privacy Policy
            </a>
            .
          </p>
        </section>
      </motion.section>
    </main>
  );
}
