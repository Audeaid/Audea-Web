'use client';

import { faMicrophone, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

export const RecordingButton = ({
  type,
  handleClick,
}: {
  type: 'Record' | 'Cancel' | 'Stop';
  handleClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  if (type === 'Record') {
    return (
      <button
        className="bg-primaryDark rounded-full w-[80px] h-[80px] flex items-center justify-center shadow-2xl"
        aria-label="Record audio"
        onClick={handleClick}
        type="button"
      >
        <FontAwesomeIcon
          icon={faMicrophone}
          size="3x"
          className="text-onPrimaryDark"
        />
      </button>
    );
  } else if (type === 'Cancel') {
    return (
      <button
        className="bg-errorDark rounded-full w-fit h-[80px] flex items-center justify-center shadow-2xl text-onErrorDark text-2xl font-bold px-4"
        aria-label="Cancel audio recording"
        onClick={handleClick}
        type="button"
      >
        Cancel
      </button>
    );
  } else if (type === 'Stop') {
    return (
      <button
        className="bg-errorDark rounded-full w-[80px] h-[80px] flex items-center justify-center shadow-2xl"
        aria-label="Stop audio recording"
        onClick={handleClick}
        type="button"
      >
        <FontAwesomeIcon icon={faStop} size="3x" className="text-onErrorDark" />
      </button>
    );
  } else {
    return <></>;
  }
};
