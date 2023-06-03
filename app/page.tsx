import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

export default function Page() {
  const { userId: clerkUserId } = auth();

  if (clerkUserId) {
    redirect('/app');
  } else {
    redirect('/login');
  }
}
