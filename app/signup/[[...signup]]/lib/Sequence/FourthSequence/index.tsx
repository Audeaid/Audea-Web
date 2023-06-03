'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';
import { useState } from 'react';
import OtpInput from 'react-otp-input';

const FourthSequence = ({
  email,
  handleClerkSubmit,
}: {
  email: string;
  handleClerkSubmit: (_code: string) => void;
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-left select-none">
        Please verify your email
      </h2>

      <p>
        We&apos;ve sent a one-time code to <b>{email}</b>
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          try {
            const formData = new FormData(e.currentTarget);

            const otpArr: string[] = [];

            for (let i = 0; i < 6; i++) {
              const otpNum = formData.get(`otp-${i}`);

              if (otpNum !== null) {
                otpArr.push(otpNum.toString());
              }
            }

            const otp = otpArr.join('');

            handleClerkSubmit(otp);
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        }}
        className="flex flex-col gap-4"
      >
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
    </motion.section>
  );
};

export default FourthSequence;
