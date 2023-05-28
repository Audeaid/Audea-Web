import { cookies } from 'next/headers';
import { getAllContent } from './graphql';
import { redirect } from 'next/navigation';
import * as jwt from 'jsonwebtoken';
import Client from './lib';

export interface AuthTokenPayload {
  userId: string;
}

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const content = await getAllContent(token);

  const { userId } = jwt.verify(
    token,
    process.env.APP_SECRET as string
  ) as unknown as AuthTokenPayload;

  if (content !== null) {
    return <Client incomingContent={content} userId={userId} />;
  } else {
    redirect('/');
  }
}
