'use client';

import { motion } from 'framer-motion';
import { FormEventHandler } from 'react';
import TextInput from '$components/TextInput';
import LoadingSpinner from '$components/LoadingSpinner';
import SocialMediaLogin from '$components/SocialMediaLogin';

const socmedButton = [
  {
    type: 'google',
    onClick: () => {},
    disabled: true,
    text: 'Sign up with Google',
  },
  {
    type: 'apple',
    onClick: () => {},
    disabled: true,
    text: 'Sign up with Apple',
  },
  {
    type: 'microsoft',
    onClick: () => {},
    disabled: true,
    text: 'Sign up with Microsoft',
  },
];

export const Progress1 = ({
  handleSubmit,
  errorMsg,
  loading,
}: {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  errorMsg: string | null;
  loading: boolean;
}) => {
  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="sm:text-6xl text-4xl font-bold text-center select-none">
        Sign up
      </h1>
      <section className="flex flex-col gap-8">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextInput
            placeholder="Enter your email address..."
            textLabel="Email"
            id="email"
            type="email"
            name="email"
            required={true}
          />

          <button
            className="bg-[#FDF5F2] text-sm w-full h-fit py-1.5 rounded border border-[#FAC6C4] text-[#EB5757] flex items-center justify-center"
            disabled={loading}
            type="submit"
          >
            {loading && <LoadingSpinner size={4} />}
            Sign up with email
          </button>
        </form>

        {errorMsg && (
          <p className="text-xs text-justify text-errorDark">{errorMsg}</p>
        )}

        <p className="text-center text-primaryDark select-none">Or</p>

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

        <p className="text-xs text-justify select-none">
          By clicking &quot;Sign up with Apple / Google / Microsoft /
          Email&quot; above, you acknowledge that you have read and understood,
          and agree to Audea&apos;s{' '}
          <a href="/terms" className="text-primaryDark hover:text-errorDark">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-primaryDark hover:text-errorDark">
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </motion.section>
  );
};
