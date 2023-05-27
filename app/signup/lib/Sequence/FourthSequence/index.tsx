'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import TextInput from '$components/TextInput';
import { capitalizeEveryWord } from './script';

const FourthSequence = ({
  setNameForm,
  setProgress,
}: {
  setNameForm: Dispatch<SetStateAction<string>>;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const [name, setName] = useState('Ada Lovelace');

  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-left select-none">
        What should we call you?
      </h2>

      <p>Lastly, please insert your name or nickname below.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const nameForm = formData.get('name');

          if (nameForm !== null) {
            const name = capitalizeEveryWord(nameForm.toString());
            setNameForm(name);
          }

          setProgress(5);
        }}
        className="flex flex-col gap-6"
      >
        <TextInput
          placeholder="Ada Lovelace"
          textLabel="Your name"
          id="name"
          type="text"
          name="name"
          required={true}
          maxLength={50}
          onKeyUp={(e) => {
            const name = e.currentTarget.value;

            setName(capitalizeEveryWord(name));
          }}
        />

        <section className="flex items-start justify-start gap-2">
          <div className="w-fit h-fit">
            <input type="checkbox" name="agree" id="agree" required={true} />
          </div>
          <label htmlFor="agree">
            I, {name}, hereby agree to{' '}
            <a
              href="https://audeaid.notion.site/Terms-of-Service-d0dcba2ccba54a9bb60b6c1dc0255c4f"
              className="text-primaryDark"
            >
              Audea&apos;s Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://audeaid.notion.site/Privacy-Policy-f865747ed0e142fa92680408d91fe136"
              className="text-primaryDark"
            >
              Privacy Policy
            </a>
            .
          </label>
        </section>

        <button
          className="bg-[#FDF5F2] text-sm w-full h-fit py-1.5 rounded border border-[#FAC6C4] text-[#EB5757] flex items-center justify-center"
          type="submit"
        >
          Create your account
        </button>
      </form>
    </motion.section>
  );
};

export default FourthSequence;
