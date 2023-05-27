'use client';

import { ICheckSubscription } from '../../graphql';

const SubscribeNowButton = ({
  subscriptionType,
}: {
  subscriptionType: ICheckSubscription['type'];
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
          You can subscribe to a paid plan if you&apos;d like to continue using
          Audea to convert your messy thoughts into a structured notes.
        </p>
      </section>

      <button className="w-full h-fit py-3 rounded-md shadow-xl bg-green-500 text-green-50 text-xl font-medium">
        Pay for Audea
      </button>
    </section>
  );
};

export default SubscribeNowButton;
