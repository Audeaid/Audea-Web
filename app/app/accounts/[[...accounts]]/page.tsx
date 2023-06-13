import { auth } from '@clerk/nextjs';
import './styles.css';
import { redirect } from 'next/navigation';
import Client from './client';

export default function Page() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  return (
    <section className="w-fit h-fit flex items-center justify-start mx-auto text-foreground">
      <Client />
    </section>
  );
}
