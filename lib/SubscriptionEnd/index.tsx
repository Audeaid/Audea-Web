'use client';

import { ICheckSubscription } from '@/app/notallowed/graphql';
import cookieCutter from 'cookie-cutter';
import { useRouter } from 'next/navigation';
import { deleteAccount, getAllContent } from './graphql';
import { useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { convertArrayToCSV } from './helper';

const SubscriptionEnd = ({
  email,
  subscriptionType,
  extended,
  token,
}: {
  email: string;
  subscriptionType: ICheckSubscription['type'];
  extended: boolean;
  token: string;
}) => {
  const router = useRouter();

  const [exportFile, setExportFile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [csvString, setCsvString] = useState('');

  return (
    <main className="min-h-screen min-w-screen">
      <section className="w-full h-full mx-auto py-20 max-w-[600px] flex flex-col gap-20 sm:px-0 px-4">
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
              You can subscribe to a paid plan if you&apos;d like to continue
              using Audea to convert your messy thoughts into a structured
              notes.
            </p>
          </section>

          <button className="w-full h-fit py-3 rounded-md shadow-xl bg-green-500 text-green-50 text-xl font-medium">
            Pay for Audea
          </button>
        </section>

        {subscriptionType === 'TRIAL' && !extended && (
          <section className="flex flex-col gap-2">
            <button className="w-full h-fit py-3 rounded-md shadow-xl bg-blue-500 text-blue-50 text-xl font-medium">
              Restart your trial
            </button>

            <p className="font-light text-base text-gray-400 text-center">
              <span className="font-bold">One time offer</span>: Since you
              didn&apos;t end up using Audea much during your initial trial, you
              can restart your trial and get a fresh 7 days.
            </p>
          </section>
        )}

        <section className="flex flex-col text-gray-300 gap-4">
          <p>
            Need help? Email us at{' '}
            <a className="text-primaryDark" href="mailto:support@audea.id">
              support@audea.id
            </a>
          </p>

          <section className="flex flex-col gap-1">
            <p>
              You are logged in as: <span className="font-medium">{email}</span>
            </p>

            <p>
              Wrong account?{' '}
              <button
                className="text-primaryDark"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  cookieCutter.set('audea_token', '', { expires: new Date(0) });
                  cookieCutter.set('audea_signInProvider', '', {
                    expires: new Date(0),
                  });
                  router.push('/login');
                }}
              >
                Log out
              </button>
            </p>
          </section>

          <section className="flex sm:flex-row flex-col sm:items-center sm:justify-start justify-center gap-1">
            <p>Not upgrading?</p>
            {(() => {
              if (loading) {
                return <LoadingSpinner size={4} />;
              } else {
                if (exportFile) {
                  return (
                    <a
                      className="text-primaryDark"
                      href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                        csvString
                      )}`}
                      download={'audea-content.csv'}
                      onClick={async () => {
                        // delete account
                        await deleteAccount(token);
                      }}
                    >
                      Download content and proceed on deleting your account
                    </a>
                  );
                } else {
                  return (
                    <button
                      className="text-primaryDark"
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();

                        setLoading(true);
                        const allContent = await getAllContent(token);

                        const csvString = convertArrayToCSV(allContent);
                        setCsvString(csvString);

                        setExportFile(true);
                        setLoading(false);
                      }}
                    >
                      Export data and delete your account
                    </button>
                  );
                }
              }
            })()}
          </section>
        </section>
      </section>
    </main>
  );
};

export default SubscriptionEnd;
