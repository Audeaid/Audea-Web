'use client';

import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DownloadVoiceNote = ({ voiceNoteUrl }: { voiceNoteUrl: string }) => {
  return (
    <a
      className="border-2 border-onPrimaryContainer rounded-md shadow-lg min-w-fit w-full h-fit py-2 sm:px-8 px-2 text-center flex items-center justify-center gap-2 text-onPrimaryContainer select-none sm:flex-row flex-col"
      download={true}
      href={voiceNoteUrl}
    >
      <FontAwesomeIcon icon={faDownload} />
      Download audio
    </a>
  );
};

export default DownloadVoiceNote;
