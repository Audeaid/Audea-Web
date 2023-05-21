import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import LoginClient from './client';

export default function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (token && signInProvider) {
    redirect('/app');
  } else {
    return <LoginClient />;
  }
}
