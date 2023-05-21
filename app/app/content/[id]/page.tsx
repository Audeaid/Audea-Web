import { cookies } from 'next/headers';
import { getOneContent } from './graphql';
import { redirect } from 'next/navigation';
import { BulletPointsWithSummary } from '@/lib/BulletPointsWithSummary';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const content = await getOneContent(token, id);

  if (!content.gptGenerated) redirect('/');

  const parseContent: any[] = JSON.parse(content.gptGenerated);

  return (
    <section className="max-w-[1300px] pb-20 mt-10 sm:px-10 px-4 w-full mx-auto">
      {(() => {
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
      })()}
    </section>
  );
}
