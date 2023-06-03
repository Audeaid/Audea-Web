import { UserProfile } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center pb-20">
      <UserProfile />
    </main>
  );
}
