'use client';

import { MouseEventHandler } from 'react';

export const RecordingInProgress = ({
  remainingTime,
  cancelRecording,
}: {
  remainingTime: number;
  cancelRecording: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <section className="flex flex-col gap-4">
      <p>Recording in progress...</p>
      <p className="text-primaryDark font-bold text-6xl text-center">
        {Math.floor(remainingTime / 60)}:
        {remainingTime % 60 < 10 && remainingTime % 60 !== 0
          ? `0${remainingTime % 60}`
          : remainingTime % 60}
        {remainingTime % 60 === 0 ? '0' : ''}
      </p>
      <button
        className="text-sm text-onPrimary underline"
        onClick={cancelRecording}
        type="button"
      >
        Cancel
      </button>
    </section>
  );
};
