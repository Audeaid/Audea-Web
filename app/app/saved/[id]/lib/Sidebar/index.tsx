'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import DeleteContent from './DeleteContent';
import { motion } from 'framer-motion';
import ViewTranscript from './ViewTranscript';
import DownloadVoiceNote from './DownloadVoiceNote';
import { MouseEventHandler } from 'react';

export interface IContent {
  __typename: 'Content';
  id: string;
  title: string;
  createdAt: string;
  gptGenerated: string;
  transcript: string;
  typeOfPromptId: string;
  voiceNoteUrl: string;
  writingStyle: string;
  outputLanguage: string;
}

const Sidebar = ({
  token,
  content,
  router,
  onClose,
}: {
  token: string;
  content: IContent;
  router: AppRouterInstance;
  onClose: MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <>
      <div
        className="min-h-screen min-w-screen bg-black/60 fixed inset-0 z-10"
        onClick={onClose}
      />

      <motion.aside
        className="fixed right-0 bottom-0 sm:w-fit sm:h-full w-full h-fit bg-white sm:px-8 sm:py-12 py-4 px-4 sm:overflow-hidden overflow-auto shadow-inner text-onPrimaryContainer z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h6 className="font-bold text-primary text-2xl sm:block hidden my-2">
          Actions
        </h6>

        <section className="flex sm:flex-col flex-row gap-4 sm:mt-4 mt-0">
          <DownloadVoiceNote voiceNoteUrl={content.voiceNoteUrl} />
          <ViewTranscript
            token={token}
            transcript={content.transcript}
            contentId={content.id}
            //   router={router}
            outputLanguage={content.outputLanguage}
            writingStyle={content.writingStyle}
            typeOfPromptId={content.typeOfPromptId}
          />
          <DeleteContent
            title={content.title}
            contentId={content.id}
            router={router}
            token={token}
          />
        </section>
      </motion.aside>
    </>
  );
};

export default Sidebar;
