'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInForm() {
  return (
    <main className="min-w-screen min-h-screen flex items-center justify-center">
      <SignIn />
    </main>
  );
}
