import { SignIn, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { login: string } }) {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (token) redirect('/app');

  if (params.login) {
    console.log(JSON.stringify(params.login));
    if (params.login[1] === 'sso-callback') {
      console.log('do something here');
    }
  }
  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <SignIn routing="path" path="/login" />
    </main>
  );
}
