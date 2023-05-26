import { cookies } from 'next/headers';
import { checkSubscription } from './graphql';
import { redirect } from 'next/navigation';
import SubscriptionEnd from '@/lib/SubscriptionEnd';

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
      <SubscriptionEnd
        email={user.email}
        subscriptionType={type}
        extended={extended}
        token={token}
      />
    );
  } else {
    redirect('/');
  }
}
