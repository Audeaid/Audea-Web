'use client';

import BackButton from '@/lib/BackButton';
import { IGetOneContent } from '../graphql';
import ErrorShouldDelete from './ErrorShouldDelete';
import { useRouter } from 'next/navigation';
import GenerateContent from './GenerateContent';
import { BulletPointsWithSummary } from '../view';

export default function Client({
  content,
  token,
  id,
}: {
  content: IGetOneContent;
  token: string;
  id: string;
}) {
  const router = useRouter();

  const renderContent = () => {
    if (
      content.typeOfPromptId === null ||
      content.voiceNoteUrl === null ||
      content.outputLanguage === null ||
      content.writingStyle === null
    ) {
      return <ErrorShouldDelete token={token} contentId={id} router={router} />;
    } else if (content.transcript === null || content.gptGenerated === null) {
      return (
        <GenerateContent
          token={token}
          contentId={content.id}
          voiceNoteUrl={content.voiceNoteUrl}
          typeOfPromptId={content.typeOfPromptId}
          transcript={content.transcript}
          gptGenerated={content.gptGenerated}
          writingStyle={content.writingStyle}
          outputLanguage={content.outputLanguage}
        />
      );
    } else {
      const parseContent: any[] = JSON.parse(content.gptGenerated);

      if (content.typeOfPromptId === '646a2fc687e737835670b7b3') {
        return (
          <BulletPointsWithSummary
            content={parseContent}
            title={content.title ?? 'No title'}
            createdAt={content.createdAt}
            dir={content.outputLanguage === 'ARABIC' ? 'rtl' : 'ltr'}
          />
        );
      } else {
        return <></>;
      }
    }
  };

  return (
    <section className="max-w-[1300px] pb-20 mt-10 sm:px-10 px-4 w-full mx-auto">
      <BackButton href="/app/saved" />
      {renderContent()}
    </section>
  );
}
