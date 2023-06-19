import { checkSubscription } from './graphql';
import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';
import { generateUrl } from '@/utils/url';

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) throw new Error('clerkUserId is null');

    const token = signJwt(clerkUserId);

    const { endDate, type, extended } = await checkSubscription(token);

    const subscriptionEnd = new Date() >= new Date(endDate);

    if (subscriptionEnd) {
      return (
        <Client
          subscriptionType={type}
          hasExtendedTrial={extended}
          token={token}
        />
      );
    } else {
      return redirect('/app');
    }
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/notallowed`
      )}`
    );
    return redirect(url.href);
  }
}
