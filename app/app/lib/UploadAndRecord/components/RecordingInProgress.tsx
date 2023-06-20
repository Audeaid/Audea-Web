'use client';

import { Button } from '@/components/ui/button';
import cn from '@/utils/cn';
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
      <p className="font-bold text-6xl text-center">
        {Math.floor(remainingTime / 60)}:
        {remainingTime % 60 < 10 && remainingTime % 60 !== 0
          ? `0${remainingTime % 60}`
          : remainingTime % 60}
        {remainingTime % 60 === 0 ? '0' : ''}
      </p>
      <Button
        className={cn('text-sm')}
        onClick={cancelRecording}
        type="button"
        variant="link"
      >
        Cancel
      </Button>
    </section>
  );
};
