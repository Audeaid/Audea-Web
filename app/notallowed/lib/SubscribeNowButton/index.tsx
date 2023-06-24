'use client';

import { ICheckSubscription } from '../../graphql';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import PricingTable from '@/app/app/subscriptions/lib/PricingTable';

const SubscribeNowButton = ({
  subscriptionType,
  stripeCustomerId,
  clerkUserId,
}: {
  subscriptionType: ICheckSubscription['type'];
  stripeCustomerId: string;
  clerkUserId: string;
}) => {
  return (
    <section className="flex flex-col gap-8">
      <section className="flex flex-col gap-2">
        <h1 className="font-bold text-4xl">
          Your{' '}
          {subscriptionType === 'MONTHLY' || subscriptionType === 'YEARLY'
            ? 'subscription'
            : 'free trial'}{' '}
          is over.
        </h1>
        <p className="font-light text-xl text-gray-400">
          {subscriptionType === 'MONTHLY' || subscriptionType === 'YEARLY'
            ? 'You need to subscribe to a paid plan again'
            : 'You can subscribe to a paid plan'}{' '}
          if you&apos;d like to continue using Audea to convert your messy
          thoughts into a structured notes.
        </p>
      </section>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="w-full h-fit py-3 rounded-md shadow-xl bg-green-500 text-green-50 text-xl font-medium">
            Pay for Audea
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pick a plan</AlertDialogTitle>
          </AlertDialogHeader>

          <PricingTable
            stripeCustomerId={stripeCustomerId}
            clerkUserId={clerkUserId}
          />
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default SubscribeNowButton;
