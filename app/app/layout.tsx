import HamburgerSidebar from '@/lib/HamburgerSidebar';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (!token) redirect('/login');

  return (
    <main className="min-w-screen min-h-screen overflow-x-hidden flex flex-col">
      <nav className="w-full h-fit flex justify-start px-10 py-10 max-h-[130px] items-center">
        <HamburgerSidebar token={token as string} />
      </nav>

      {children}
    </main>
  );
}
