'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import TextInput from '$components/TextInput';
import { capitalizeEveryWord } from './script';

const ThirdSequence = ({
  setFirstName,
  setLastName,
  handleClerkSubmit,
}: {
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  handleClerkSubmit: (_firstName: string, _lastName: string) => void;
}) => {
  const [firstNameHere, setFirstNameHere] = useState('Ada');
  const [lastNameHere, setLastNameHere] = useState('Lovelace');

  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-left select-none">
        What should we call you?
      </h2>

      <p>Please insert you first and last name.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const firstNameForm = formData.get('first-name');
          const lastNameForm = formData.get('last-name');

          if (firstNameForm !== null && lastNameForm !== null) {
            const firstName = capitalizeEveryWord(firstNameForm.toString());
            const lastName = capitalizeEveryWord(lastNameForm.toString());
            setFirstName(firstName);
            setLastName(lastName);

            handleClerkSubmit(firstName, lastName);
          }
        }}
        className="flex flex-col gap-6"
      >
        <TextInput
          placeholder="Ada"
          textLabel="First Name"
          id="first-name"
          type="text"
          name="first-name"
          required={true}
          maxLength={50}
          onKeyUp={(e) => {
            const name = e.currentTarget.value;

            setFirstNameHere(capitalizeEveryWord(name));
          }}
        />

        <TextInput
          placeholder="Lovelace"
          textLabel="Last Name"
          id="last-name"
          type="text"
          name="last-name"
          required={true}
          maxLength={50}
          onKeyUp={(e) => {
            const name = e.currentTarget.value;

            setLastNameHere(capitalizeEveryWord(name));
          }}
        />

        <section className="flex items-start justify-start gap-2">
          <div className="w-fit h-fit">
            <input type="checkbox" name="agree" id="agree" required={true} />
          </div>
          <label htmlFor="agree">
            I, {firstNameHere} {lastNameHere}, hereby agree to{' '}
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

export default ThirdSequence;
