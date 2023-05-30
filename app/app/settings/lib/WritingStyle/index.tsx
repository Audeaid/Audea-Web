'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Tooltip from '@/components/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { presets } from '@/app/utils/presets';

const WritingStyle = ({
  userWritingStyle,
  edit,
  setWritingStyle,
}: {
  userWritingStyle: string;
  edit: boolean;
  setWritingStyle: Dispatch<SetStateAction<string>>;
}) => {
  const renderInitialOption = () => {
    if (userWritingStyle === 'ASK') {
      return 'Ask me everytime';
    } else if (userWritingStyle === 'Default') {
      return 'Default';
    } else {
      return 'Custom';
    }
  };
  const [custom, setCustom] = useState(
    userWritingStyle === 'ASK' || userWritingStyle === 'Default' ? false : true
  );
  const [selectedOption, setSelectedOption] = useState(renderInitialOption());
  const [textInput, setTextInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (textInput === '' && userWritingStyle !== 'ASK') {
      setSelectedOption('Default');
      setWritingStyle('Default');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textInput]);

  useEffect(() => {
    if (
      userWritingStyle === 'Default' ||
      userWritingStyle === 'ASK' ||
      userWritingStyle === 'Ask me everytime'
    ) {
      setCustom(false);
    }
  }, [userWritingStyle]);

  return (
    <section className="flex sm:flex-row sm:items-center sm:justify-between flex-col gap-4 flex-wrap">
      <section className="flex flex-col gap-2">
        <h3 className="text-2xl text-primaryDark font-medium">Writing style</h3>
        <p className="md:max-w-full max-w-[365px]">
          Make the AI write in any style you want.{' '}
          <Tooltip text="Writing style is not 100% effective if the output language is not English." />
        </p>
      </section>

      {(() => {
        if (edit) {
          if (custom) {
            return (
              <section className="flex flex-col gap-2">
                <input
                  type="text"
                  className="py-2 px-1 border-2 border-primary rounded-md text-onPrimaryContainer"
                  placeholder={
                    userWritingStyle === 'ASK' ||
                    userWritingStyle === 'Default' ||
                    userWritingStyle === 'Ask me everytime'
                      ? 'Write like shakespeare'
                      : userWritingStyle
                  }
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    setWritingStyle(e.target.value);
                  }}
                  value={textInput}
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
                      <ul className="absolute z-10 bg-white rounded-md shadow-md mt-2 w-full overflow-hidden text-onPrimaryContainer">
                        {presets.map((preset) => (
                          <li
                            key={preset}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                            onClick={() => {
                              setTextInput(preset);
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
            );
          } else {
            return (
              <select
                id="dropdown"
                name="output-language"
                value={selectedOption}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'Custom') {
                    setCustom(true);
                  } else {
                    setWritingStyle(val);
                    setSelectedOption(val);
                  }
                }}
                className="py-2 px-1 border-2 border-primary rounded-md text-onPrimaryContainer"
              >
                {['Default', 'Custom', 'Ask me everytime'].map(
                  (value, index) => {
                    return (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    );
                  }
                )}
              </select>
            );
          }
        } else {
          return (
            <p className="py-2 px-1 border-2 border-gray-700 bg-gray-600 rounded-md text-white w-fit cursor-not-allowed">
              {(() => {
                if (userWritingStyle === '') {
                  return 'Default';
                } else if (userWritingStyle === 'ASK') {
                  return 'Ask me everytime';
                } else {
                  return userWritingStyle;
                }
              })()}
            </p>
          );
        }
      })()}
    </section>
  );
};

export default WritingStyle;
