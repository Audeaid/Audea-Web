import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Client from './lib';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  const forgotToken = searchParams.token as string | undefined;

  if (forgotToken) {
    if (token && signInProvider) {
      redirect('/app');
    } else {
      return <Client token={forgotToken} />;
    }
  } else {
    redirect('/');
  }
}
