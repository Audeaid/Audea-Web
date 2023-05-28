'use client';

import { faCreditCard } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import moment from 'moment';
import RenderButtonComponent from '../../RenderButtonComponent';

export const RenderSubscription = ({
  endDate,
  startDate,
  subscriptionType,
}: {
  endDate: string;
  startDate: string;
  subscriptionType:
    | 'TRIAL'
    | 'MONTHLY'
    | 'LIFETIME'
    | 'YEARLY'
    | 'EARLYADOPTER';
}) => {
  const totalTime = moment(endDate).diff(moment(startDate));
  const remainingTime = moment(endDate).diff(moment());
  const progress = ((totalTime - remainingTime) / totalTime) * 100;
  const remainingTimeDate = moment(remainingTime).format('DDD');

  if (subscriptionType === 'TRIAL' || subscriptionType === 'EARLYADOPTER') {
    return (
      <section className="flex flex-col gap-1">
        <RenderButtonComponent
          type="anchor"
          icon={faCreditCard}
          text="Free trial"
        />
        <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-green-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-right text-xs font-light">
          {remainingTimeDate} days remaining
        </p>
      </section>
    );
  } else if (subscriptionType === 'LIFETIME') {
    return (
      <RenderButtonComponent
        type="button"
        icon={faCreditCard}
        text="Lifetime Subscription"
        xtraClassName="cursor-not-allowed"
      />
    );
  } else {
    return (
      <RenderButtonComponent
        type="anchor"
        icon={faCreditCard}
        text="Manage Subscription"
      />
    );
  }
};
