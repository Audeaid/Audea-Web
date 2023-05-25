'use client';

import { IGetAllContent } from '@/app/app/saved/graphql';
import { faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OneContentListView from './OneContentListView';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import OneContentGalleryView from './OneContentGalleryView';
import BackButton from '../BackButton';

export const ContentList = ({ content }: { content: IGetAllContent[] }) => {
  const router = useRouter();
  const [listView, setListView] = useState(false);

  return (
    <motion.section
      className={`flex flex-col gap-10 mt-10 pb-10 sm:px-10 px-4 max-w-[1300px] mx-auto w-full select-none`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <BackButton href={'/app'} />
      <section className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primaryDark">Saved Notes</h1>

        <section className="flex gap-2 items-center justify-center">
          <button
            className={`${
              listView
                ? 'bg-gray-400 text-onPrimaryContainer'
                : 'text-primaryDark'
            } rounded-md shadow-sm text-lg w-[35px] h-[35px] flex items-center justify-center`}
            onClick={() => {
              setListView(true);
            }}
            aria-label="List view"
          >
            <FontAwesomeIcon icon={faList} />
          </button>
          <button
            className={`${
              !listView
                ? 'bg-gray-400 text-onPrimaryContainer'
                : 'text-primaryDark'
            } rounded-md shadow-sm text-lg w-[35px] h-[35px] flex items-center justify-center`}
            onClick={() => {
              setListView(false);
            }}
            aria-label="Gallery view"
          >
            <FontAwesomeIcon icon={faTableCellsLarge} />
          </button>
        </section>
      </section>

      {listView ? (
        <section className="flex flex-col gap-4">
          {content.map((value, index) => {
            return (
              <OneContentListView
                key={index}
                contentId={value.id}
                title={value.title}
                date={value.createdAt}
                router={router}
              />
            );
          })}
        </section>
      ) : (
        <section className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {content.map((value, index) => {
            return (
              <OneContentGalleryView
                contentId={value.id}
                title={value.title}
                gptGenerated={value.gptGenerated}
                date={value.createdAt}
                router={router}
                key={index}
              />
            );
          })}
        </section>
      )}
    </motion.section>
  );
};
