'use client';

import { useState, useRef } from 'react';
import type { ITextInput } from './index.d';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const TextInput: React.FC<ITextInput> = ({
  id = 'text',
  textLabel,
  handleChange,
  ...props
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const clearText = () => {
    setText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className={`flex flex-col gap-1 select-none`}>
      <label htmlFor={id}>{textLabel}</label>
      <section
        className={`flex justify-between items-center w-full h-fit bg-onPrimary shadow appearance-none border-2 rounded py-2 px-3 text-onPrimaryContainer leading-tight focus-within:outline-none focus-within:shadow-primaryDark focus-within:border-primaryDark gap-2`}
      >
        <input
          className={`bg-onPrimary focus:outline-none w-full`}
          id={id}
          ref={inputRef}
          onChange={(e) => {
            setText(e.target.value as string);

            if (handleChange) {
              handleChange(e);
            }
          }}
          value={text}
          {...props}
        />

        {text.length > 0 && (
          <button onClick={clearText} type="button">
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
      </section>
    </section>
  );
};

export default TextInput;
