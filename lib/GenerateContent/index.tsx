'use client';

import { getTranscriptViaWhisperFromUrl } from './api';
import {
  getTypeOfPrompt,
  publicGetGptResponse,
  updateContent,
} from '../NewContent/apis';
import LoadingContent from '@/components/LoadingContent';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddLottieAnimation from '@/components/AddLottieAnimation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

export const GenerateContent = ({
  token,
  contentId,
  voiceNoteUrl,
  typeOfPromptId,
  transcript,
  gptGenerated,
}: {
  token: string;
  contentId: string;
  voiceNoteUrl: string;
  typeOfPromptId: string;
  transcript: string | null;
  gptGenerated: string | null;
}) => {
  const router = useRouter();
  const [condition, setCondition] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const handleClick = async () => {
    if (transcript === null && gptGenerated === null) {
      setIsUploading(true);

      try {
        setCondition('Getting the transcript...');
        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId);
        if (!typeOfPrompt) throw new Error('typeOfPrompt is null');

        const whisperData = await getTranscriptViaWhisperFromUrl(voiceNoteUrl);
        await updateContent({
          token,
          contentId,
          title: null,
          voiceNoteUrl: null,
          transcript: whisperData.text,
          gptGenerated: null,
          typeOfPromptId: null,
        });

        setCondition('Transcript is being analyzed by AI...');
        const systemPrompt = typeOfPrompt.systemPrompt;
        const userPrompt = `Audio transcription:
        ${whisperData.text}
        
        Outcome language: Original`;

        const gptResponse = await publicGetGptResponse(
          systemPrompt,
          userPrompt
        );

        const actualGptResponse = gptResponse.choices[0].message.content;
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
          contentId,
          title: title,
          voiceNoteUrl: null,
          transcript: null,
          gptGenerated: actualGptResponse,
          typeOfPromptId: null,
        });

        router.push(`/app/saved/${response.id}`);
      } catch (error) {
        console.error(error);
        setIsUploading(false);
      }
    }

    if (gptGenerated === null && transcript !== null) {
      setIsUploading(true);

      try {
        setCondition('Transcript is being analyzed by AI...');
        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId);
        if (!typeOfPrompt) throw new Error('typeOfPrompt is null');

        const systemPrompt = typeOfPrompt.systemPrompt;
        const userPrompt = `Audio transcription:
      ${transcript}
      
      Outcome language: Original`;

        const gptResponse = await publicGetGptResponse(
          systemPrompt,
          userPrompt
        );

        const actualGptResponse = gptResponse.choices[0].message.content;
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
          contentId,
          title: title,
          voiceNoteUrl: null,
          transcript: null,
          gptGenerated: actualGptResponse,
          typeOfPromptId: null,
        });

        router.push(`/app/saved/${response.id}`);
      } catch (error) {
        console.error(error);
        setIsUploading(false);
      }
    }
  };

  return (
    <>
      {isUploading ? (
        <LoadingContent condition={condition} />
      ) : (
        <section className="flex flex-col gap-4 w-fit mx-auto items-center justify-center">
          <div className="max-w-[500px]">
            <AddLottieAnimation
              path={'/lottie/46864-lovely-cats.json'}
              loop={true}
            />
          </div>
          <section className="mt-[-6rem] flex flex-col gap-8 items-center justify-center">
            <section className="flex flex-col gap-2">
              <p className="font-bold text-xl max-w-[600px] text-center text-primaryDark">
                Sorry, it seems like there is an error while generating your
                transcript and or content.
              </p>
              <p className="text-center font-light">
                Please click the button below to retry.
              </p>
            </section>
            <button
              onClick={handleClick}
              className="px-4 py-1 rounded-md shadow-xl text-lg bg-primaryDark text-onPrimaryDark w-fit flex items-center justify-center gap-2"
              type="button"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
              Retry generating content
            </button>
          </section>
        </section>
      )}
    </>
  );
};
