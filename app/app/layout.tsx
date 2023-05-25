import HamburgerSidebar from '$lib/HamburgerSidebar';
import { cookies } from 'next/headers';

export default function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  return (
    <main className="min-w-screen min-h-screen overflow-x-hidden flex flex-col">
      <nav className="w-full h-fit flex justify-start px-10 py-10 max-h-[130px] items-center">
        <HamburgerSidebar token={token} />
      </nav>

      {children}
    </main>
  );
}
