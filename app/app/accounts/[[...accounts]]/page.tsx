import { auth } from '@clerk/nextjs';
import './styles.css';
import { redirect } from 'next/navigation';
import Client from './client';
import { generateUrl } from '@/utils/url';

export default function Page({ params }: { params: { accounts: string } }) {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) redirect('/login');

    return (
      <section className="w-fit h-fit flex items-center justify-start mx-auto text-foreground">
        <Client />
      </section>
    );
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/app/accounts/${params.accounts ? params.accounts[0] : ''}`
      )}`
    );
    return redirect(url.href);
  }
}
