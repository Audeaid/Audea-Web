import { cookies } from 'next/headers';
import { getAllContent } from './graphql';
import { redirect } from 'next/navigation';
import { ContentList } from '$lib/ContentList';

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const content = await getAllContent(token);

  if (content !== null) {
    return <ContentList content={content} />;
  } else {
    redirect('/');
  }
}
