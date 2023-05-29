'use client';

import { motion } from 'framer-motion';
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useLayoutEffect,
  useState,
} from 'react';
import ProgressButton from '@/components/ProgressButton';
import toast from 'react-hot-toast';
import {
  IGetAllTypeOfPrompt,
  getAllTypeOfPrompt,
  updateContentSettings,
} from './script';

const ThirdSequence = ({
  setTypeOfPromptId,
  handleClick,
  token,
}: {
  setTypeOfPromptId: Dispatch<SetStateAction<string>>;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  token: string;
}) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [allTypeOfPrompt, setAllTypeOfPrompt] = useState<
    IGetAllTypeOfPrompt[] | null
  >(null);

  useLayoutEffect(() => {
    (async () => {
      const response = await getAllTypeOfPrompt({ token });
      setAllTypeOfPrompt(response);
      setTypeOfPromptId(response[0].id);
      setSelectedOption(response[0].id);
    })();
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
          What is the type of content you want?
        </label>
        {allTypeOfPrompt && (
          <select
            id="dropdown"
            name="output-language"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
              setTypeOfPromptId(e.target.value);
            }}
            className="py-2 px-1 border-2 border-primary rounded-md"
          >
            {allTypeOfPrompt.map((value, index) => {
              return (
                <option key={index} value={value.id}>
                  {value.displayName}
                </option>
              );
            })}
          </select>
        )}
      </section>

      <p>
        See all the examples{' '}
        <a
          href="https://audeaid.notion.site/d9242908bb9f421b8d7fe86c0f5a424b?v=9df833bfa8da4d11b600295e741893fb"
          target="_blank"
          className="text-primary underline"
        >
          here
        </a>
        .
      </p>

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
        from={'60%'}
        to={'90%'}
        onClick={(e) => {
          if (isChecked) {
            // save the settings
            toast
              .promise(
                updateContentSettings({
                  typeOfPromptId: selectedOption,
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

export default ThirdSequence;
