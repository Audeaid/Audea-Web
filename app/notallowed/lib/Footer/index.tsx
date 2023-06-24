'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useState } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { convertArrayToCSV, getAllContent } from './script';
import { useClerk, useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';

const Footer = ({
  token,
  router,
}: {
  token: string;
  router: AppRouterInstance;
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);
  const [exportFile, setExportFile] = useState(false);
  const [csvString, setCsvString] = useState('');

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="w-80 h-4 rounded-full" />

        <div className="flex flex-col gap-1">
          <Skeleton className="w-80 h-4 rounded-full" />
          <Skeleton className="w-64 h-4 rounded-full" />
        </div>

        <Skeleton className="w-72 h-4 rounded-full" />

        <Skeleton className="w-72 h-4 rounded-full" />
      </div>
    );
  }

  const renderExportAndDelete = () => {
    if (loading) {
      return <LoadingSpinner size={4} />;
    } else {
      if (exportFile) {
        return (
          <a
            className="text-blue-500"
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(
              csvString
            )}`}
            download={'audea-content.csv'}
          >
            Download content
          </a>
        );
      } else {
        return (
          <button
            className="text-blue-500"
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
            Export data
          </button>
        );
      }
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <p>
        Need help? Email us at{' '}
        <a className="text-blue-500" href="mailto:support@audea.id">
          support@audea.id
        </a>
      </p>

      <section className="flex flex-col gap-1">
        <p>
          You are logged in as:{' '}
          <span className="font-medium">
            {user.primaryEmailAddress?.emailAddress}
          </span>
        </p>

        <p>
          Wrong account?{' '}
          <button
            className="text-blue-500"
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              await signOut();
              router.push('/login');
            }}
          >
            Log out
          </button>
        </p>
      </section>

      <section className="flex sm:flex-row flex-col sm:items-center sm:justify-start justify-center items-start gap-1">
        <p>Not upgrading?</p>
        {renderExportAndDelete()}
      </section>

      <p>
        Want to see invoices?{' '}
        <a className="text-blue-500" href="/app/subscriptions">
          head to subscriptions page
        </a>
      </p>
    </section>
  );
};

export default Footer;
