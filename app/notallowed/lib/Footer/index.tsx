'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import { useState } from 'react';
import cookieCutter from 'cookie-cutter';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { convertArrayToCSV, deleteAccount, getAllContent } from './script';

const Footer = ({
  token,
  router,
  email,
}: {
  token: string;
  router: AppRouterInstance;
  email: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [exportFile, setExportFile] = useState(false);
  const [csvString, setCsvString] = useState('');

  const renderExportAndDelete = () => {
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
  };

  return (
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

      <section className="flex sm:flex-row flex-col sm:items-center sm:justify-start justify-center items-start gap-1">
        <p>Not upgrading?</p>
        {renderExportAndDelete()}
      </section>
    </section>
  );
};

export default Footer;
