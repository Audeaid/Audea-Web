'use client';

import { Toaster } from 'react-hot-toast';
import UploadAndRecord from './UploadAndRecord';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  createNewContent,
  getTypeOfPrompt,
  publicGetGptResponse,
  publicGetTranscriptFromWhisper,
  updateContent,
  uploadVoiceNoteToS3,
} from './apis';
import LoadingContent from '$components/LoadingContent';

const NewContent = ({
  token,
  hasContent,
}: {
  token: string;
  hasContent: boolean;
}) => {
  const router = useRouter();
  const [condition, setCondition] = useState('inactive');
  const [isUploading, setIsUploading] = useState(false);

  return (
    <motion.section
      className="w-full h-full min-h-screen"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => event.preventDefault()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="select-none mt-10 pb-10 sm:px-10 px-4 max-w-[1300px] mx-auto">
        <section className="flex flex-col gap-4">
          <h3 className="sm:text-4xl text-2xl font-bold text-center">
            Turn your messy thoughts into structured notes.
          </h3>
          <h4 className="sm:text-lg text-base font-light text-center">
            Upload your voice record or record it. Audea will do its magic.
          </h4>
          {hasContent ? (
            <a href="/app/saved" className="mx-auto">
              <button className="sm:text-lg text-base font-light text-center w-fit h-fit underline">
                See your saved notes
              </button>
            </a>
          ) : (
            <h5 className="sm:text-lg text-base font-light text-center">
              See how Audea works
            </h5>
          )}
        </section>

        <section>
          {isUploading === false ? (
            <UploadAndRecord
              onFileUpload={(file) => {
                (async () => {
                  setIsUploading(true);

                  // First, create new content
                  setCondition('Creating new database...');
                  const content = await createNewContent(token);

                  // Upload the voice note to s3 using contentId
                  setCondition('Uploading the audio file...');
                  const uploadedVoiceNote = await uploadVoiceNoteToS3(
                    file,
                    content.id
                  );

                  await updateContent({
                    token,
                    contentId: content.id,
                    title: null,
                    voiceNoteUrl: uploadedVoiceNote.Location,
                    transcript: null,
                    gptGenerated: null,
                    typeOfPromptId: null,
                  });

                  // Get the transcript from whisper
                  setCondition('Getting the transcript...');
                  const transcript = await publicGetTranscriptFromWhisper(file);
                  await updateContent({
                    token,
                    contentId: content.id,
                    title: null,
                    voiceNoteUrl: null,
                    transcript: transcript.text,
                    gptGenerated: null,
                    typeOfPromptId: null,
                  });

                  // Get typeOfPrompt
                  setCondition('Getting prompt from our database...');
                  const typeOfPromptId = '646a2fc687e737835670b7b3'; // Our first typeOfPrompt
                  const typeOfPrompt = await getTypeOfPrompt(
                    token,
                    typeOfPromptId
                  );
                  if (typeOfPrompt === null)
                    throw new Error('typeOfPrompt is null');

                  await updateContent({
                    token,
                    contentId: content.id,
                    title: null,
                    voiceNoteUrl: null,
                    transcript: null,
                    gptGenerated: null,
                    typeOfPromptId: typeOfPromptId,
                  });

                  // Get chatGPT response
                  setCondition('Transcript is being analyzed by AI...');
                  const systemPrompt = typeOfPrompt.systemPrompt;
                  const userPrompt = `Audio transcription:
                  ${transcript.text}

                  Outcome language: Original`;

                  const gptResponse = await publicGetGptResponse(
                    systemPrompt,
                    userPrompt
                  );

                  // Parsing the response
                  setCondition('Parsing AI response...');
                  const actualGptResponse =
                    gptResponse.choices[0].message.content;
                  const jsonGptResponse = JSON.parse(actualGptResponse);

                  let title = '';
                  for (const obj of jsonGptResponse) {
                    if (obj.type === 'title') {
                      title = obj.content;
                      break;
                    }
                  }

                  const response = await updateContent({
                    token,
                    contentId: content.id,
                    title: title,
                    voiceNoteUrl: null,
                    transcript: null,
                    gptGenerated: actualGptResponse,
                    typeOfPromptId: null,
                  });

                  router.push(`/app/saved/${response.id}`);
                })();
              }}
            />
          ) : (
            <LoadingContent condition={condition} />
          )}
        </section>

        <Toaster position="bottom-right" />
      </section>
    </motion.section>
  );
};

export default NewContent;
