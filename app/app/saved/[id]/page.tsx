import { cookies } from 'next/headers';
import { getOneContent } from './graphql';
import { BulletPointsWithSummary } from '$lib/BulletPointsWithSummary';
import { GenerateContent } from '$lib/GenerateContent';
import BackButton from '$lib/BackButton';
import ErrorShouldDelete from '@/lib/ErrorShouldDelete';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const content = await getOneContent(token, id);

  return (
    <section className="max-w-[1300px] pb-20 mt-10 sm:px-10 px-4 w-full mx-auto">
      <BackButton href="/app/saved" />
      {(() => {
        if (content.typeOfPromptId === null || content.voiceNoteUrl === null) {
          return <ErrorShouldDelete token={token} contentId={id} />;
        } else if (
          content.transcript === null ||
          content.gptGenerated === null
        ) {
          return (
            <GenerateContent
              token={token}
              contentId={content.id}
              voiceNoteUrl={content.voiceNoteUrl}
              typeOfPromptId={content.typeOfPromptId}
              transcript={content.transcript}
              gptGenerated={content.gptGenerated}
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
              />
            );
          } else {
            return <></>;
          }
        }
      })()}
    </section>
  );
}
