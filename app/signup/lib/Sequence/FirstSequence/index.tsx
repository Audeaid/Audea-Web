'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import TextInput from '$components/TextInput';
import LoadingSpinner from '$components/LoadingSpinner';
import SocialMediaLogin from '$components/SocialMediaLogin';
import { getDeletedUser, getEmailOtp, searchUserByEmail } from './script';

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

const FirstSequence = ({
  setEmail,
  setProgress,
}: {
  setEmail: Dispatch<SetStateAction<string>>;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();

            setLoading(true);

            const formData = new FormData(e.currentTarget);
            const emailForm = formData.get('email');

            try {
              if (emailForm !== null) {
                const isEmailExistResponse = await searchUserByEmail({
                  email: emailForm.toString(),
                });

                const isAccountDeletedResponse = await getDeletedUser({
                  email: emailForm.toString(),
                });

                const isEmailExist = isEmailExistResponse !== null;
                const isAccountDeleted = isAccountDeletedResponse !== null;

                if (isEmailExist) {
                  setErrorMsg('Email is already registered, please login!');
                  setLoading(false);
                } else if (isAccountDeleted) {
                  setErrorMsg(
                    'Email is already been associated to a deleted account!'
                  );
                  setLoading(false);
                } else {
                  // Email does not exist
                  setEmail(emailForm.toString());

                  await getEmailOtp({ email: emailForm.toString() });

                  setLoading(false);

                  setProgress(2);
                }
              }
            } catch (error) {
              setErrorMsg(
                "We could not reach Audea's server. Please try again in a few minutes."
              );

              setLoading(false);

              console.error(error);
            }
          }}
        >
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
  );
};

export default FirstSequence;
