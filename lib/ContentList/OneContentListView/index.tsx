'use client';

import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const OneContentListView = ({
  contentId,
  title,
  date,
  router,
}: {
  contentId: string;
  title: string | null;
  date: string;
  router: AppRouterInstance;
}) => {
  return (
    <button
      className="flex items-center justify-between cursor-pointer w-full"
      onClick={() => {
        router.push(`/app/saved/${contentId}`);
      }}
      type="button"
    >
      <section className="flex items-center justify-center gap-2 font-normal sm:text-lg text-base">
        <FontAwesomeIcon icon={faNewspaper} />
        <p className="lg:max-w-[800px] md:max-w-[450px] sm:max-w-[300px] max-w-[200px] truncate">
          {title ?? 'No Title'}
        </p>
      </section>

      <p className="font-light text-base sm:block hidden">
        {moment(date).format('MMMM DD, YYYY HH:mm')}
      </p>

      <p className="font-light text-xs sm:hidden block">
        {moment(date).format('MM/DD/YY')}
      </p>
    </button>
  );
};

export default OneContentListView;
