'use client';

import { motion } from 'framer-motion';
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { outputLanguageList } from '@/app/utils/outputLanguage';
import ProgressButton from '@/components/ProgressButton';
import toast from 'react-hot-toast';
import { updateContentSettings } from './script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const FirstSequence = ({
  setOutputLanguage,
  handleClick,
  token,
}: {
  setOutputLanguage: Dispatch<SetStateAction<string>>;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  token: string;
}) => {
  const [selectedOption, setSelectedOption] = useState('TRANSCRIPT');
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setOutputLanguage('TRANSCRIPT');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.section
      className="max-w-[400px] flex flex-col gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="flex flex-col gap-1">
        <label className="font-medium" htmlFor="output-language">
          What is your output language?
        </label>
        <select
          id="dropdown"
          name="output-language"
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            setOutputLanguage(e.target.value);
          }}
          className="py-2 px-1 border-2 border-primary rounded-md"
        >
          {outputLanguageList.map((value, index) => {
            return (
              <option key={index} value={value.db}>
                {value.displayName}
              </option>
            );
          })}
        </select>
      </section>

      {selectedOption === 'TRANSCRIPT' && (
        <section className="border-2 border-red-800 rounded-lg">
          <p className="w-full h-fit bg-red-800 text-white text-center text-sm font-bold py-1">
            <FontAwesomeIcon icon={faTriangleExclamation} /> CAUTION
          </p>
          <p className="p-2 text-justify text-sm">
            If your audio contains mixed language paired with English (i.e.
            mixing English with other languages), then the AI have a tendency to
            produce the content in English.
          </p>
        </section>
      )}

      <section className="flex items-start justify-start gap-2">
        <div className="w-fit h-fit">
          <input
            type="checkbox"
            name="setAsDefault"
            id="setAsDefault"
            checked={isChecked}
            onChange={(e) => {
              setIsChecked(e.target.checked);
            }}
          />
        </div>
        <label htmlFor="setAsDefault">Don&apos;t ask me again</label>
      </section>

      <ProgressButton
        disabled={!selectedOption}
        from={'0%'}
        to={'30%'}
        onClick={(e) => {
          if (isChecked) {
            // save the settings
            toast
              .promise(
                updateContentSettings({
                  outputLanguage: selectedOption,
                  token,
                }),
                {
                  loading: 'Saving your settings....',
                  error: 'Error saving your settings!',
                  success: 'Success saving your settings!',
                }
              )
              .then(() => {
                handleClick(e);
              });
          } else {
            handleClick(e);
          }
        }}
        type="button"
      />
    </motion.section>
  );
};

export default FirstSequence;
