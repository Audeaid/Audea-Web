import { cookies } from 'next/headers';
import { checkSubscription } from './graphql';
import { redirect } from 'next/navigation';
import Client from './lib';

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const { endDate, type, user, extended } = await checkSubscription(token);

  const subscriptionEnd = new Date() >= new Date(endDate);

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
