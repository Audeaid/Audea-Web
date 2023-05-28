'use client';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { extendTrial } from './script';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

const RestartTrial = ({
  router,
  token,
}: {
  router: AppRouterInstance;
  token: string;
}) => {
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex flex-col gap-2">
      <button
        className="w-full h-fit py-3 rounded-md shadow-xl bg-blue-500 text-blue-50 text-xl font-medium flex items-center gap-4"
        onClick={async () => {
          setLoading(true);

          await extendTrial(token);

          router.push('/app');

          setLoading(false);
        }}
      >
        {loading && <LoadingSpinner size={4} />}
        Restart your trial
      </button>

      <p className="font-light text-base text-gray-400 text-center">
        <span className="font-bold">One time offer</span>: Since you didn&apos;t
        end up using Audea much during your initial trial, you can restart your
        trial and get a fresh 7 days.
      </p>
    </section>
  );
};

export default RestartTrial;
