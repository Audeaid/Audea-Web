'use client';

import { IGetOneContent } from '../graphql';
import ErrorShouldDelete from './ErrorShouldDelete';
import { useRouter } from 'next/navigation';
import GenerateContent from './GenerateContent';
import { BulletPointsWithSummary } from '../view';
import Sidebar, { IContent } from './Sidebar';
import { useState } from 'react';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <section className="relative">
      {renderContent()}

      {(() => {
        if (
          content.gptGenerated !== null &&
          content.transcript !== null &&
          content.outputLanguage !== null &&
          content.title !== null &&
          content.typeOfPromptId !== null &&
          content.voiceNoteUrl !== null &&
          content.writingStyle !== null &&
          sidebarOpen
        ) {
          return (
            <Sidebar
              content={content as IContent}
              router={router}
              token={token}
              onClose={() => {
                setSidebarOpen(false);
              }}
            />
          );
        } else {
          return <></>;
        }
      })()}
    </section>
  );
}
