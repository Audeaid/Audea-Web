'use client';

import { motion } from 'framer-motion';
import { Dispatch, SetStateAction, useState } from 'react';
import { capitalizeEveryWord } from './script';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import cn from '@/utils/cn';

const ThirdSequence = ({
  setFirstName,
  setLastName,
  handleClerkSubmit,
  initialFirstName,
  initialLastName,
}: {
  setFirstName: Dispatch<SetStateAction<string>>;
  setLastName: Dispatch<SetStateAction<string>>;
  handleClerkSubmit: (_firstName: string, _lastName: string) => void;
  initialFirstName: string | null;
  initialLastName: string | null;
}) => {
  const [firstNameHere, setFirstNameHere] = useState(initialFirstName ?? 'Ada');
  const [lastNameHere, setLastNameHere] = useState(
    initialLastName ?? 'Lovelace'
  );

  const [firstNameValue, setFirstNameValue] = useState(initialFirstName ?? '');
  const [lastNameValue, setLastNameValue] = useState(initialLastName ?? '');

  return (
    <motion.section
      className="max-w-[400px] flex flex-col gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          What should we call you?
        </h2>
        <p className="text-sm text-muted-foreground">
          Please insert you first and last name.
        </p>
      </div>

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
        <div className="flex flex-col gap-2">
          <Label htmlFor="first-name">First name</Label>
          <Input
            placeholder="Ada"
            id="first-name"
            type="text"
            name="first-name"
            required={true}
            maxLength={50}
            onKeyUp={(e) => {
              const name = e.currentTarget.value;

              setFirstNameHere(capitalizeEveryWord(name));
            }}
            value={firstNameValue}
            onChange={(e) => {
              setFirstNameValue(e.target.value);
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            placeholder="Lovelace"
            id="last-name"
            type="text"
            name="last-name"
            required={true}
            maxLength={50}
            onKeyUp={(e) => {
              const name = e.currentTarget.value;

              setLastNameHere(capitalizeEveryWord(name));
            }}
            value={lastNameValue}
            onChange={(e) => {
              setLastNameValue(e.target.value);
            }}
          />
        </div>

        <section className="flex items-start justify-start gap-2">
          <div className="w-fit h-fit">
            <input type="checkbox" name="agree" id="agree" required={true} />
          </div>
          <Label htmlFor="agree" className={cn('leading-5 text-left')}>
            I, {firstNameHere} {lastNameHere}, hereby agree to Audea&apos;s{' '}
            <a
              href="https://audeaid.notion.site/Terms-of-Service-d0dcba2ccba54a9bb60b6c1dc0255c4f"
              className="hover:text-blue-500"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://audeaid.notion.site/Privacy-Policy-f865747ed0e142fa92680408d91fe136"
              className="hover:text-blue-500"
            >
              Privacy Policy
            </a>
            .
          </Label>
        </section>

        <Button type="submit">Create your account</Button>
      </form>
    </motion.section>
  );
};

export default ThirdSequence;
