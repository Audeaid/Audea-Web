'use client';

import { toast } from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import LoadingContent from '$components/LoadingContent';
import UploadAndRecordNew from './UploadAndRecordNew';
import {
  createNewContent,
  getTypeOfPrompt,
  publicGetGptResponse,
  publicGetTranscriptFromWhisper,
  updateContent,
  uploadVoiceNoteToS3,
} from './script';
import { IGetContentSettings } from '../graphql';

export default function Client({
  hasContent,
  token,
  contentSettings,
}: {
  hasContent: boolean;
  token: string;
  contentSettings: IGetContentSettings;
}) {
  const router = useRouter();
  const [condition, setCondition] = useState('inactive');
  const [isUploading, setIsUploading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [userContentSettings, _setUserContentSettings] =
    useState(contentSettings);

  // eslint-disable-next-line no-unused-vars
  const [bearerToken, _setBearerToken] = useState(token);

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
              <button
                className="sm:text-lg text-base font-light text-center w-fit h-fit underline"
                tabIndex={-1}
              >
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
            <UploadAndRecordNew
              onFileUpload={(
                file,
                outputLanguage,
                writingStyle,
                typeOfPromptId
              ) => {
                (async () => {
                  setIsUploading(true);

                  if (
                    outputLanguage === 'ASK' ||
                    writingStyle === 'ASK' ||
                    typeOfPromptId === '647391c118e8a4e1170d3ec9'
                  ) {
                    throw new Error(
                      'Somewhere, there is an error because the data is invalid'
                    );
                  }

                  // First, create new content
                  setCondition('Creating new database...');
                  const content = await createNewContent(token);

                  try {
                    // Get typeOfPrompt
                    setCondition('Getting prompt from our database...');
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
                      writingStyle: writingStyle,
                      outputLanguage: outputLanguage,
                    });

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
                      writingStyle: null,
                      outputLanguage: null,
                    });

                    // Get the transcript from whisper
                    setCondition('Getting the transcript...');
                    const transcript = await publicGetTranscriptFromWhisper(
                      file
                    );
                    await updateContent({
                      token,
                      contentId: content.id,
                      title: null,
                      voiceNoteUrl: null,
                      transcript: transcript.text,
                      gptGenerated: null,
                      typeOfPromptId: null,
                      writingStyle: null,
                      outputLanguage: null,
                    });

                    // Get chatGPT response
                    setCondition('Transcript is being analyzed by AI...');
                    const systemPrompt = typeOfPrompt.systemPrompt;
                    const userPrompt = `Audio transcription:
                    ${transcript.text}
                    Output language: ${
                      outputLanguage === 'TRANSCRIPT'
                        ? 'Same as transcript'
                        : outputLanguage
                    }
                    Writing style: ${writingStyle}`;

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
                      writingStyle: null,
                      outputLanguage: null,
                    });

                    router.push(`/app/saved/${response.id}`);
                  } catch (error) {
                    console.error(error);
                    toast.error('An error occurred during generating content!');
                    router.push(`/app/saved/${content.id}`);
                  }
                })();
              }}
              contentSettings={userContentSettings}
              token={bearerToken}
            />
          ) : (
            <LoadingContent condition={condition} />
          )}
        </section>
      </section>
    </motion.section>
  );
}
