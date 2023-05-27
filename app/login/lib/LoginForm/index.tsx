'use client';

import { useState } from 'react';
import { loginWithPassword, searchUserByEmail } from './script';
import * as bcrypt from 'bcryptjs';
import cookieCutter from 'cookie-cutter';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import TextInput from '@/components/TextInput';
import LoadingSpinner from '@/components/LoadingSpinner';

const LoginForm = ({ router }: { router: AppRouterInstance }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailIsPasswordRegistered, setEmailIsPasswordRegistered] =
    useState(false);
  const [forgotHash, setForgotHash] = useState('');

  return (
    <>
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
    </>
  );
};

export default LoginForm;
