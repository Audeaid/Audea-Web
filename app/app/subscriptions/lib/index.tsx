'use client';

import { ICheckSubscription } from '../graphql';
import Stripe from 'stripe';
import InvoicesTable from './InvoicesTable';
import moment from 'moment';
import { Fireworks } from '@fireworks-js/react';
import { motion } from 'framer-motion';
import PricingTable from './PricingTable';
import SubscribeNowButton from '@/app/notallowed/lib/SubscribeNowButton';

export default function Client({
  stripeCustomerId,
  clerkUserId,
  currentSubscription,
  invoices,
}: {
  stripeCustomerId: string;
  clerkUserId: string;
  currentSubscription: ICheckSubscription;
  invoices: Stripe.Invoice[];
}) {
  const endDate = new Date(currentSubscription.endDate);
  const startDate = new Date(currentSubscription.startDate);

  const now = new Date();

  const endDateLocale = endDate.toLocaleString();
  const startDateLocale = startDate.toLocaleString();

  return (
    <motion.section
      className="flex flex-col gap-10 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(() => {
        if (now > endDate) {
          return (
            <SubscribeNowButton
              subscriptionType={currentSubscription.type}
              stripeCustomerId={stripeCustomerId}
              clerkUserId={clerkUserId}
            />
          );
        } else {
          if (
            currentSubscription.type === 'MONTHLY' ||
            currentSubscription.type === 'YEARLY'
          ) {
            return (
              <section className="w-full h-fit z-10 flex flex-col gap-2">
                <h3 className="text-3xl font-medium">
                  🎉 You&apos;re already a premium member with Audea
                </h3>
                <p>
                  Your premium ends at{' '}
                  {moment(endDateLocale).format('HH:mm DD MMMM YYYY')}.
                </p>
              </section>
            );
          } else if (currentSubscription.type === 'LIFETIME') {
            return (
              <section className="w-full h-fit z-10 flex flex-col gap-2">
                <h3 className="text-3xl font-medium">
                  🎉 You&apos;re already a LIFETIME premium with Audea
                </h3>
                <p>Thank you for believing in Audea.</p>
              </section>
            );
          } else {
            const remainingTime = moment(endDateLocale).diff(
              moment(),
              'seconds'
            );
            const totalDuration = moment(endDateLocale).diff(
              moment(startDateLocale),
              'seconds'
            );
            const to = `${
              ((totalDuration - remainingTime) / totalDuration) * 100
            }%`;

            return (
              <section className="flex flex-col gap-20">
                <section className="flex flex-col gap-8">
                  <section className="flex flex-col gap-2">
                    <h3 className="text-3xl font-medium">
                      😅 You&apos;re on a Free Trial
                    </h3>

                    <p>
                      Your trial ends at{' '}
                      {moment(endDateLocale).format('HH:mm DD MMMM YYYY')}.
                    </p>
                  </section>

                  <section className="flex flex-col gap-2">
                    <div className="min-w-full h-fit dark:bg-gray-800 bg-gray-400 rounded-full">
                      <motion.div
                        className="h-[30px] dark:bg-green-800 bg-green-400 rounded-full"
                        animate={{ width: to }}
                        initial={{ width: 0 }}
                        transition={{ duration: 2 }}
                      />
                    </div>

                    <p className="text-right text-muted-foreground font-light">
                      {moment(endDateLocale).diff(moment(), 'days')} days
                      remaining
                    </p>
                  </section>
                </section>

                <section className="flex flex-col gap-10">
                  <section className="flex flex-col gap-2">
                    <h3 className="text-3xl font-medium">
                      Love Audea? Become premium now!💕
                    </h3>
                    <p className="text-muted-foreground">
                      Don&apos;t worry, we will add the remaining days in your
                      trial to your subscription!
                    </p>
                  </section>

                  <PricingTable
                    stripeCustomerId={stripeCustomerId}
                    clerkUserId={clerkUserId}
                  />

                  <p className="text-center text-muted-foreground">
                    If you make a payment, we only charge you a one-time payment
                    only. That means that it is not an auto-renewal payment. We
                    carefully choose our pricing and methodologies so that it
                    benefits you, our user, the most. Read more on our{' '}
                    <a
                      className="underline"
                      href="https://audeaid.notion.site/Pricing-Manifesto-775142d7ebf34bb184915a16dfd8dd5b?pvs=4"
                    >
                      pricing manifesto
                    </a>
                    .
                  </p>
                </section>
              </section>
            );
          }
        }
      })()}

      {(currentSubscription.type === 'MONTHLY' ||
        currentSubscription.type === 'YEARLY' ||
        currentSubscription.type === 'LIFETIME') &&
        invoices.length > 0 && <InvoicesTable invoices={invoices} />}

      {(currentSubscription.type === 'MONTHLY' ||
        currentSubscription.type === 'YEARLY' ||
        currentSubscription.type === 'LIFETIME') &&
        now < endDate && (
          <Fireworks
            options={{
              rocketsPoint: {
                min: 0,
                max: 100,
              },
            }}
            style={{
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              position: 'fixed',
              background: 'hsl(var(--background))',
              zIndex: '-10',
              opacity: '25%',
            }}
          />
        )}
    </motion.section>
  );
}
