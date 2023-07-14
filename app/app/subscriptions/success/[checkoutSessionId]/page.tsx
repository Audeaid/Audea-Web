import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';
import { generateUrl } from '@/utils/url';
import axios from 'axios';
import Stripe from 'stripe';
import { subscriptionPrices } from '@/app/utils/subscriptionPrices';
import {
  createPaidObject,
  getPaidObject,
  purchasedSubscription,
} from './graphql';

export default async function Page({
  params,
  searchParams,
}: {
  params: { checkoutSessionId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const checkoutSessionId: string = params.checkoutSessionId;
  const priceId = searchParams.priceId as string;

  if (!checkoutSessionId || !priceId) return redirect('/app/subscriptions');

  try {
    const { userId } = auth();

    if (!userId) return redirect('/login');

    const token = signJwt(userId);

    const { data }: { data: Stripe.Response<Stripe.Checkout.Session> } =
      await axios.post(generateUrl('/api/stripe/retrieve-session').href, {
        sessionId: checkoutSessionId,
      });

    if (data.payment_status === 'paid') {
      // search product based on priceId
      const product = subscriptionPrices.find((v) => v.id === priceId);

      if (!product)
        return (
          <section className="min-w-screen min-h-screen bg-background text-foreground fixed inset-0 z-[99999999999] flex items-center justify-center select-none">
            <section className="flex flex-col items-center justify-center text-center max-w-[300px] gap-4 mx-4">
              <p className="text-lg font-medium">Error</p>

              <p className="text-sm font-light">
                An error occurred while trying to resolve your payment. Most
                likely that your payment has gone through. Please contact
                support at{' '}
                <a href="mailto:support@audea.id">support@audea.id</a> and we
                will resolve this issue ASAP.
              </p>

              <a className="text-blue-500 underline" href="/app/subscriptions">
                Go back
              </a>
            </section>
          </section>
        );

      const searchPaidObject = await getPaidObject(token, checkoutSessionId);

      if (searchPaidObject !== null) {
        if (searchPaidObject.redeem) {
          return (
            <section className="min-w-screen min-h-screen bg-background text-foreground fixed inset-0 z-[99999999999] flex items-center justify-center select-none">
              <section className="flex flex-col items-center justify-center text-center max-w-[300px] gap-4 mx-4">
                <p className="text-lg font-medium">Expired link</p>

                <p className="text-sm font-light">
                  This link has expired. This means that your payment has
                  already been processed and paid.
                </p>

                <a
                  className="text-blue-500 underline"
                  href="/app/subscriptions"
                >
                  Go back
                </a>
              </section>
            </section>
          );
        } else {
          return (
            <section className="min-w-screen min-h-screen bg-background text-foreground fixed inset-0 z-[99999999999] flex items-center justify-center select-none">
              <section className="flex flex-col items-center justify-center text-center max-w-[300px] gap-4 mx-4">
                <p className="text-lg font-medium">Error</p>

                <p className="text-sm font-light">
                  An error occurred while trying to resolve your payment. Most
                  likely that your payment has gone through. Please contact
                  support at{' '}
                  <a href="mailto:support@audea.id">support@audea.id</a> and we
                  will resolve this issue ASAP.
                </p>

                <a
                  className="text-blue-500 underline"
                  href="/app/subscriptions"
                >
                  Go back
                </a>
              </section>
            </section>
          );
        }
      } else {
        await createPaidObject(token, checkoutSessionId);

        //extend the user subscription date
        const response = await purchasedSubscription(token, product.db);
        const endDate = new Date(response.endDate);

        return (
          <section className="min-w-screen min-h-screen bg-background text-foreground fixed inset-0 z-[99999999999] flex items-center justify-center select-none">
            <section className="flex flex-col items-center justify-center text-center max-w-[300px] gap-4 mx-4">
              <p className="text-lg font-medium">Payment successful</p>

              <p className="text-sm font-light">
                Thank you so much for your{' '}
                {(() => {
                  if (response.type === 'MONTHLY') return '1 month';
                  else if (response.type === 'YEARLY') return '1 year';
                  else if (response.type === 'LIFETIME60') return 'lifetime';
                  else return '';
                })()}{' '}
                purchased of Audea.
              </p>

              {response.type === 'MONTHLY' ||
                (response.type === 'YEARLY' && (
                  <p className="text-sm font-light">
                    Your new subscriptions will end on{' '}
                    {endDate.toLocaleTimeString()}{' '}
                    {endDate.toLocaleDateString()} local time.
                  </p>
                ))}

              <a className="text-blue-500 underline" href="/app">
                Go home
              </a>
            </section>
          </section>
        );
      }
    } else {
      return redirect('/app/subscriptions');
    }
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/app/subscriptions/${checkoutSessionId}?priceId=${priceId}`
      )}`
    );
    return redirect(url.href);
  }
}
