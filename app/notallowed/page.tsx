import { checkSubscription } from './graphql';
import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';
import { generateUrl } from '@/utils/url';
import {
  IGetStripeCustomer,
  createStripeCustomer,
  getStripeCustomer,
} from '../app/subscriptions/graphql';

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) throw new Error('clerkUserId is null');

    const token = signJwt(clerkUserId);

    const { endDate, type, extended } = await checkSubscription(token);

    const subscriptionEnd = new Date() >= new Date(endDate);

    let stripeCustomer: IGetStripeCustomer | null = null;

    const response = await getStripeCustomer(token);

    if (response !== null) {
      stripeCustomer = response;
    } else {
      const newStripeCustomer = await createStripeCustomer(token);
      stripeCustomer = newStripeCustomer;
    }

    if (subscriptionEnd) {
      return (
        <Client
          subscriptionType={type}
          hasExtendedTrial={extended}
          token={token}
          stripeCustomerId={stripeCustomer.stripeCustomerId}
          clerkUserId={clerkUserId}
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
