'use client';

import { Toaster } from 'react-hot-toast';
import UploadAndRecord from './UploadAndRecord';
import {
  createNewContent,
  getGptResponse,
  getTranscriptFromWhisper,
  getTypeOfPrompt,
  updateContent,
  uploadVoiceNoteToS3,
} from './apis';
import { Dispatch, SetStateAction, useState } from 'react';
import AddLottieAnimation from '$components/AddLottieAnimation';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const EmptyPage = ({
  token,
  setStillUploading,
}: {
  token: string;
  setStillUploading: Dispatch<SetStateAction<boolean>>;
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
        </section>

        <section>
          {isUploading === false ? (
            <UploadAndRecord
              onFileUpload={(file) => {
                (async () => {
                  setIsUploading(true);
                  setStillUploading(true);
                  // First, create new content
                  setCondition('Creating new database...');
                  const content = await createNewContent(token);

                  // Upload the voice note to s3 using contentId
                  setCondition('Uploading the audio file...');
                  const uploadedVoiceNote = await uploadVoiceNoteToS3(
                    file,
                    content.id
                  );

                  // Get the transcript from whisper
                  setCondition('Getting the transcript...');
                  const transcript = await getTranscriptFromWhisper(file);

                  // Get typeOfPrompt
                  setCondition('Getting prompt from our database...');
                  const typeOfPromptId = '646a2fc687e737835670b7b3'; // Our first typeOfPrompt
                  const typeOfPrompt = await getTypeOfPrompt(
                    token,
                    typeOfPromptId
                  );

                  // Get chatGPT response
                  setCondition('Transcript is being analyzed by AI...');
                  if (typeOfPrompt === null)
                    throw new Error('typeOfPrompt is null');

                  const systemPrompt = typeOfPrompt.systemPrompt;
                  const userPrompt = `Audio transcription:
                  ${transcript.text}

                  Outcome language: Original`;

                  const gptResponse = await getGptResponse(
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

                  // Update all of it to database
                  setCondition('Update database connection...');
                  await updateContent({
                    token,
                    contentId: content.id,
                    title,
                    voiceNoteUrl: uploadedVoiceNote.Location,
                    transcript: transcript.text,
                    gptGenerated: actualGptResponse,
                    typeOfPromptId,
                  });

                  router.push(`/app/content/${content.id}`);
                })();
              }}
            />
          ) : (
            <section className="w-full h-fit border-dashed border-2 border-primaryDark rounded-xl py-20 max-w-[800px] mx-auto relative sm:px-0 px-4 bg-gray-900 flex flex-col items-center justify-center mt-10">
              <div className="max-w-[500px]">
                <AddLottieAnimation
                  path="/lottie/9844-loading-40-paperplane.json"
                  loop={true}
                />
              </div>
              <p className="font-bold sm:text-2xl text-lg text-center">
                {condition}
              </p>
            </section>
          )}
        </section>

        <Toaster position="bottom-right" />
      </section>
    </motion.section>
  );
};
