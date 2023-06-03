'use client';

import { motion } from 'framer-motion';
import { Dispatch, Reducer, SetStateAction, useReducer, useState } from 'react';
import TextInput from '@/components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faEye,
  faEyeSlash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

interface PasswordState {
  password: string;
  hasSymbol: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

type PasswordAction = { type: 'UPDATE_PASSWORD'; payload: string };

const SecondSequence = ({
  setPasswordForm,
  setProgress,
}: {
  setPasswordForm: Dispatch<SetStateAction<string>>;
  setProgress: Dispatch<SetStateAction<number>>;
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordState, passwordDispatch] = useReducer<
    Reducer<PasswordState, PasswordAction>
  >(
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_PASSWORD':
          return {
            password: action.payload,
            hasSymbol: /[!@#$%^&*]/.test(action.payload),
            hasNumber: /\d/.test(action.payload),
            hasUppercase: /[A-Z]/.test(action.payload),
          };
        default:
          return state;
      }
    },
    {
      password: '',
      hasSymbol: false,
      hasNumber: false,
      hasUppercase: false,
    }
  );

  const passwordRequirement = [
    { text: 'Minimum 1 symbol', bool: passwordState.hasSymbol },
    { text: 'Minimum 1 number', bool: passwordState.hasNumber },
    { text: 'Minimum 1 uppercase letter', bool: passwordState.hasUppercase },
  ];

  return (
    <motion.section
      className="max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-3xl font-bold text-left select-none">
        Create strong password
      </h2>

      <p>Next, please create a strong password for your Audea account.</p>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const formData = new FormData(e.currentTarget);
          const passwordForm = formData.get('password');

          if (passwordForm !== null) {
            setPasswordForm(passwordForm.toString());
          }

          setProgress(3);
        }}
        className="flex flex-col gap-6"
      >
        <section className="flex flex-col gap-4">
          <section className="flex flex-col gap-1">
            <TextInput
              placeholder="New password"
              textLabel="Create your password"
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required={true}
              pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$"
              minLength={8}
              maxLength={64}
              handleChange={(e) => {
                const password = e.target.value;
                setPassword(password);
                passwordDispatch({
                  type: 'UPDATE_PASSWORD',
                  payload: password,
                });
              }}
            />

            <button
              type="button"
              className="text-sm font-medium flex gap-1 items-center text-purple-400 w-fit h-fit"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </section>

          <section className="flex flex-col gap-1">
            <p className="text-base">Password must have:</p>
            <ul className="flex flex-col gap-0 text-sm">
              {passwordRequirement.map(({ text, bool }, index) => {
                return (
                  <li
                    key={index}
                    className="flex gap-1 items-center justify-start"
                  >
                    <div className="w-fit h-fit">
                      <FontAwesomeIcon
                        icon={bool ? faCheck : faXmark}
                        className={`${
                          bool ? 'text-green-500' : 'text-red-500'
                        }`}
                      />
                    </div>
                    <p>{text}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        </section>

        <section className="flex flex-col gap-1">
          <TextInput
            placeholder="Confirm password"
            textLabel="Confirm your password"
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required={true}
            pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$"
            minLength={8}
            maxLength={64}
            handleChange={(e) => {
              const password = e.target.value;
              setConfirmPassword(password);
            }}
          />

          <button
            type="button"
            className="text-sm font-medium flex gap-1 items-center text-purple-400 w-fit h-fit"
            onClick={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            {showConfirmPassword ? 'Hide password' : 'Show password'}
          </button>
        </section>

        <button
          className="bg-[#FDF5F2] text-sm w-full h-fit py-1.5 rounded border border-[#FAC6C4] text-[#EB5757] flex items-center justify-center"
          type="submit"
          disabled={password !== confirmPassword}
        >
          Create your password
        </button>
      </form>
    </motion.section>
  );
};

export default SecondSequence;
