import { checkSubscription } from './graphql';
import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export default async function Page() {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (!token) throw new Error('Token is null');

  const { endDate, type, user, extended } = await checkSubscription(token);

  const subscriptionEnd = new Date() >= new Date(endDate);

  console.log('subscriptionEnd in notallowed', subscriptionEnd);

  if (subscriptionEnd) {
    return (
      <Client
        subscriptionType={type}
        hasExtendedTrial={extended}
        token={token}
        email={user.email}
      />
    );
  } else {
    redirect('/');
  }
}
