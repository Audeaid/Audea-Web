'use client';

import TextInput from '$components/TextInput';
import ProgressButton from '$components/ProgressButton';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { IPercentage } from '$components/ProgressButton/index.d';
import * as bcrypt from 'bcryptjs';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getEmailOtp } from '../helper';

export const Progress1 = ({
  token,
  setEmail,
  handleVerified,
}: {
  token: string;
  setEmail: Dispatch<SetStateAction<string>>;
  handleVerified: () => void;
}) => {
  const [text, setText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-fit"
    >
      <form
        className="flex flex-col gap-8"
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);
          setErrorMsg('');

          const formData = new FormData(e.currentTarget);
          const emailForm = formData.get('email');

          if (emailForm !== null) {
            const email = emailForm.toString();

            const verified = await bcrypt.compare(email, token);

            if (verified) {
              setEmail(email);

              getEmailOtp({ email });

              setLoading(false);

              setNext(true);

              handleVerified();
            } else {
              setLoading(false);

              setErrorMsg('Email mismatch.');
            }
          } else {
            setLoading(false);
          }
        }}
      >
        <TextInput
          placeholder="Enter your email address..."
          textLabel="Email"
          id="email"
          type="email"
          name="email"
          handleChange={(e) => {
            setText(e.target.value);
          }}
        />

        {errorMsg && (
          <p className="text-xs text-justify text-errorDark">{errorMsg}</p>
        )}

        <ProgressButton
          disabled={!text}
          type="submit"
          from="0%"
          to={((): IPercentage => {
            if (next) return '20%';
            if (text) return '10%';
            else return '0%';
          })()}
        >
          {loading && <LoadingSpinner size={4} />}
          Next
        </ProgressButton>
      </form>
    </motion.section>
  );
};
