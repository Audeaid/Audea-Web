'use client';

import { IGetAllContent } from '@/app/app/graphql';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OneContent } from './OneContent';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export const ContentList = ({ content }: { content: IGetAllContent[] }) => {
  const router = useRouter();

  return (
    <motion.section
      className="flex flex-col gap-10 mt-10 pb-10 sm:px-10 px-4 max-w-[1300px] mx-auto w-full select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primaryDark">Saved Notes</h1>
        <a href="/app/content/new">
          <button className="text-lg font-medium px-4 py-1 bg-primaryDark text-onPrimaryDark rounded-md shadow-md flex items-center justify-center gap-2">
            New <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </a>
      </section>

      <section className="flex flex-col gap-4">
        {content.map((value, index) => {
          return (
            <OneContent
              key={index}
              contentId={value.id}
              title={value.title}
              date={value.createdAt}
              router={router}
            />
          );
        })}
      </section>
    </motion.section>
  );
};
