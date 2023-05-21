'use client';

import { useState, useRef } from 'react';
import type { ITextInput } from './index.d';
import styles from './index.module.css';
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
    <section className={`${styles.section1}`}>
      <label htmlFor={id}>{textLabel}</label>
      <section className={`${styles.section2}`}>
        <input
          className={`${styles.input}`}
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
