'use client';

import LoadingSpinner from '$components/LoadingSpinner';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import OtpInput from 'react-otp-input';
import { getEmailOtp, verifyEmailOtp } from '../helper';
import ProgressButton from '$components/ProgressButton';
import toast from 'react-hot-toast';

export const Progress2 = ({
  email,
  setJwtToken,
  handleVerified,
}: {
  email: string;
  setJwtToken: Dispatch<SetStateAction<string>>;
  handleVerified: () => void;
}) => {
  const [otp, setOtp] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  const [loadingSendOtp, setLoadingSendOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <motion.section
      className="w-full h-fit flex flex-col gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <p>
        We&apos;ve sent a one-time code to <b>{email}</b>
      </p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          setLoading(true);

          try {
            toast
              .promise(verifyEmailOtp({ email, otp }), {
                loading: 'Checking your code...',
                success: 'Code verified!',
                error: 'Wrong code!',
              })
              .then(
                (data) => {
                  setLoading(false);
                  setJwtToken(data.token);
                  handleVerified();
                },
                () => {
                  setLoading(false);
                }
              );
          } catch (error) {
            console.error(error);
            setLoading(false);
          }
        }}
        className="flex flex-col gap-8"
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
        <ProgressButton disabled={!otp} type="submit" from="30%" to="40%">
          {loading && <LoadingSpinner size={4} />}
          Next
        </ProgressButton>
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
