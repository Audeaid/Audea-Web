'use client';

import { IGetAllContent } from '@/app/app/saved/graphql';
import { faList, faTableCellsLarge } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';
import BackButton from '@/lib/BackButton';
import OneContentListView from './OneContentListView';
import OneContentGalleryView from './OneContentGalleryView';

const Content = ({
  incomingContent,
  clerkUserId,
}: {
  incomingContent: IGetAllContent[];
  clerkUserId: string;
}) => {
  // const router = useRouter();
  const [listView, setListView] = useState(true);
  const [contentData, setContentData] = useState(incomingContent);

  const contentLive = gql`
    subscription ContentSubscription($clerkUserId: String!) {
      contentSubscription(clerkUserId: $clerkUserId) {
        content {
          id
          createdAt
          title
          gptGenerated
        }
        mutationType
      }
    }
  `;

  const { data } = useSubscription(contentLive, {
    variables: { clerkUserId },
  });

  useEffect(() => {
    if (data) {
      const { mutationType, content } = data.contentSubscription;

      if (mutationType === 'ADD') {
        setContentData((prevContentData) => [content, ...prevContentData]);
      } else if (mutationType === 'EDIT') {
        setContentData((prevContentData) => {
          const newContent = [...prevContentData];
          const index = newContent.findIndex((obj) => obj.id === content.id);

          if (index !== -1) {
            newContent[index] = content;
          }

          return newContent;
        });
      } else if (mutationType === 'DELETE') {
        setContentData((prevContentData) =>
          prevContentData.filter((obj) => obj.id !== content.id)
        );
      }
    }
  }, [data]);

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
          {contentData.map((value) => {
            return (
              <OneContentListView
                key={`${value.id}-list`}
                contentId={value.id}
                title={value.title}
                date={value.createdAt}
              />
            );
          })}
        </section>
      ) : (
        <section className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
          {contentData.map((value) => {
            return (
              <OneContentGalleryView
                contentId={value.id}
                title={value.title}
                gptGenerated={value.gptGenerated}
                date={value.createdAt}
                key={`${value.id}-gallery`}
              />
            );
          })}
        </section>
      )}
    </motion.section>
  );
};

export default Content;
