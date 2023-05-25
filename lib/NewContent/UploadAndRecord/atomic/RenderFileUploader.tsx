'use client';

import { faFileAudio } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ChangeEventHandler,
  Dispatch,
  DragEventHandler,
  SetStateAction,
} from 'react';

export const RenderFileUploader = ({
  currentlyDragging,
  setCurrentlyDragging,
  handleDrop,
  handleFileChange,
}: {
  currentlyDragging: boolean;
  setCurrentlyDragging: Dispatch<SetStateAction<boolean>>;
  handleDrop: DragEventHandler<HTMLElement>;
  handleFileChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <section
      className="w-full h-fit border-dashed border-2 border-primaryDark rounded-xl py-20 max-w-[800px] mx-auto relative sm:px-0 px-4"
      onDragOver={(event) => {
        event.preventDefault();
        setCurrentlyDragging(true);
      }}
      onDrop={handleDrop}
    >
      {currentlyDragging && (
        <section className="absolute inset-0 w-full h-full bg-yellow-500 rounded-xl flex items-center justify-center">
          <p className="text-center text-onPrimaryContainer text-2xl font-bold">
            Drag it here <FontAwesomeIcon icon={faFileAudio} />
          </p>
        </section>
      )}
      <section className="w-fit h-fit max-w-[400px] mx-auto flex flex-col gap-8">
        <section className="flex flex-col gap-2">
          <label
            className="text-xl font-medium cursor-pointer"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
          />
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            M4A, MP3, MP4, MPGA, WAV, or MPEG (Max. 25mb).
          </p>
        </section>
        <p className="text-sm text-primaryDark text-center">Or</p>
        <p className="text-xl font-medium text-center">
          Drag and drop an audio file here
        </p>
      </section>
    </section>
  );
};
