'use client';

import { motion } from 'framer-motion';
import {
  Dispatch,
  FormEventHandler,
  Reducer,
  SetStateAction,
  useReducer,
  useState,
} from 'react';
import TextInput from '$components/TextInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faEye,
  faEyeSlash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import ProgressButton from '$components/ProgressButton';
import { IPercentage } from '$components/ProgressButton/index.d';

interface PasswordState {
  password: string;
  hasSymbol: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
}

type PasswordAction = { type: 'UPDATE_PASSWORD'; payload: string };

export const Progress3 = ({
  handleSubmit,
  setPassword,
}: {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  setPassword: Dispatch<SetStateAction<string>>;
}) => {
  const [userPassword, setUserPassword] = useState('');
  const [userConfirmPassword, setUserConfirmPassword] = useState('');

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-fit"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
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
                setUserPassword(password);
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
              setUserConfirmPassword(password);
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

        <ProgressButton
          disabled={
            !(
              userPassword === userConfirmPassword &&
              !!userPassword &&
              !!userConfirmPassword
            )
          }
          type="submit"
          from="40%"
          to={((): IPercentage => {
            let num = 40;
            if (passwordState.hasNumber) num += 10;
            if (passwordState.hasSymbol) num += 10;
            if (passwordState.hasUppercase) num += 10;
            if (userPassword === userConfirmPassword) num += 10;
            return `${num}%` as IPercentage;
          })()}
        >
          Next
        </ProgressButton>
      </form>
    </motion.section>
  );
};
