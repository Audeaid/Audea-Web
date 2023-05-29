'use client';

import { motion } from 'framer-motion';
import {
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import ProgressButton from '@/components/ProgressButton';
import toast from 'react-hot-toast';
import { updateContentSettings } from './script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { presets } from './presets';

const SecondSequence = ({
  setWritingStyle,
  handleClick,
  token,
}: {
  setWritingStyle: Dispatch<SetStateAction<string>>;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  token: string;
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setWritingStyle('');
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
          Choose the writing style!
        </label>

        <input
          type="text"
          className="py-2 px-1 border-2 border-primary rounded-md"
          placeholder="Write like Shakespeare"
          onChange={(e) => {
            setText(e.target.value);
            setWritingStyle(e.target.value);
          }}
          value={text}
        />

        <div className="relative">
          <button
            className="w-full h-fit rounded-md bg-blue-500/20 flex items-center justify-center gap-2 text-blue-500 py-2"
            onClick={() => {
              setShowOptions(!showOptions);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            Choose style preset
          </button>

          {showOptions && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-70"
                onClick={() => setShowOptions(false)}
              />
              <ul className="absolute z-10 bg-white rounded-md shadow-md mt-2 w-full overflow-hidden">
                {presets.map((preset) => (
                  <li
                    key={preset}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                    onClick={() => {
                      setText(preset);
                      setWritingStyle(preset);
                      setShowOptions(false);
                    }}
                  >
                    {preset}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>

      <p className="text-justify">
        You can make the AI write the content in any writing style you like, or
        you can just leave it blank if you want to have the normal writing
        style.
      </p>

      <section className="border-2 border-red-800 rounded-lg">
        <p className="w-full h-fit bg-red-800 text-white text-center text-sm font-bold py-1">
          <FontAwesomeIcon icon={faTriangleExclamation} /> CAUTION
        </p>
        <p className="p-2 text-justify text-sm">
          Writing style is only 100% effective when the output language in
          English. For other languages, it may work, or it may not.
        </p>
      </section>

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
        disabled={false}
        from={'30%'}
        to={'60%'}
        onClick={(e) => {
          if (isChecked) {
            // save the settings
            toast
              .promise(
                updateContentSettings({
                  writingStyle: text === '' ? 'Default' : text,
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
      />
    </motion.section>
  );
};

export default SecondSequence;
