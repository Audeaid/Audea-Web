'use client';

import LoadingSpinner from '$components/LoadingSpinner';
import { motion } from 'framer-motion';
import { FormEventHandler, useState } from 'react';
import OtpInput from 'react-otp-input';
import { getEmailOtp } from '../helper';

export const Progress2 = ({
  email,
  loading,
  handleSubmit,
}: {
  email: string;
  loading: boolean;
  handleSubmit: FormEventHandler<HTMLFormElement>;
}) => {
  const [otp, setOtp] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);

  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-left select-none">Enter code</h2>

      <p>
        We&apos;ve sent a one-time code to <b>{email}</b>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <OtpInput
          placeholder="696969"
          value={otp}
          onChange={setOtp}
          numInputs={6}
          containerStyle={
            'w-full flex flex-row justify-between gap-1 mt-2 font-medium text-xl'
          }
          inputStyle={{
            width: '100%',
            maxWidth: '60px',
          }}
          renderInput={(props, index) => (
            <input
              {...props}
              className="border-2 border-[#d6e3ff] text-onPrimaryContainer p-2 rounded-md bg-onPrimary"
              name={`otp-${index}`}
              required={true}
            />
          )}
        />
        <button
          className="bg-[#FDF5F2] text-sm w-full h-fit py-1.5 rounded border border-[#FAC6C4] text-[#EB5757] flex items-center justify-center"
          disabled={loading}
          type="submit"
        >
          {loading && <LoadingSpinner size={4} />}
          Verify code
        </button>
      </form>

      <section className="flex sm:flex-row flex-col sm:items-center items-start sm:justify-start justify-center gap-2">
        <p>Didn&apos;t get the code? </p>

        {(() => {
          if (loadingSendOtp) {
            return <LoadingSpinner size={4} />;
          } else {
            if (resendOtp) {
              return <p>Another code has been sent!</p>;
            } else {
              return (
                <button
                  className="text-primaryDark"
                  onClick={async () => {
                    setLoadingSendOtp(true);
                    try {
                      await getEmailOtp({ email });
                      setLoadingSendOtp(false);
                      setResendOtp(true);
                    } catch (error) {
                      console.error(error);
                      setLoadingSendOtp(false);
                    }
                  }}
                >
                  Click here to resend
                </button>
              );
            }
          }
        })()}
      </section>
    </motion.section>
  );
};
