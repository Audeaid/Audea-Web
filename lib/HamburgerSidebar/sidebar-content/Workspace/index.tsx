'use client';

import {
  faClipboard,
  faGear,
  faRecycle,
} from '@fortawesome/free-solid-svg-icons';
import { RenderSubscription } from './components/RenderSubscription';
import RenderButtonComponent from '../../RenderButtonComponent';

export const Workspace = ({
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
  return (
    <section className="flex flex-col gap-2">
      <h6 className="flex gap-2 items-center text-gray-600 text-xs font-medium">
        WORKSPACE <hr className="w-full h-[2px] bg-gray-600" />
      </h6>
      <section className="flex flex-col gap-2 font-medium text-onPrimaryContainer">
        <RenderButtonComponent
          icon={faClipboard}
          text="Saved Notes"
          href="/app/saved"
          type="anchor"
        />

        <RenderButtonComponent
          icon={faGear}
          text="Settings"
          href="#"
          type="anchor"
        />

        <RenderButtonComponent
          icon={faRecycle}
          text="Integrations"
          href="#"
          type="anchor"
        />

        <RenderSubscription
          endDate={endDate}
          startDate={startDate}
          subscriptionType={subscriptionType}
        />
      </section>
    </section>
  );
};
