import { cookies } from 'next/headers';
import { getOneContent } from './graphql';
import Client from './lib';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const content = await getOneContent(token, id);

  return <Client content={content} token={token} id={id} />;
}
