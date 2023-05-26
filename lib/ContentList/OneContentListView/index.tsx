'use client';

import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const OneContentListView = ({
  contentId,
  title,
  date,
}: {
  contentId: string;
  title: string | null;
  date: string;
}) => {
  return (
    <a href={`/app/saved/${contentId}`} className="w-full h-fit">
      <button
        className="flex items-center justify-between cursor-pointer w-full"
        type="button"
        tabIndex={-1}
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
    </a>
  );
};

export default OneContentListView;
