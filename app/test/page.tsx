'use client';

import { useUser } from '@clerk/nextjs';

export default function Page() {
  // Use the useUser hook to get the Clerk.user object
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return <div>{JSON.stringify(user)}</div>;
}
