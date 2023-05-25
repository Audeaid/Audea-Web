'use client';

import moment from 'moment';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

const OneContentGalleryView = ({
  contentId,
  title,
  date,
  gptGenerated,
  router,
}: {
  contentId: string;
  title: string | null;
  gptGenerated: string | null;
  date: string;
  router: AppRouterInstance;
}) => {
  return (
    <button
      className="flex flex-col items-center justify-between cursor-pointer w-fit min-h-fit max-h-[336px] sm:max-w-[300px] max-w-[200px] min-w-full overflow-hidden border border-white rounded-lg"
      onClick={() => {
        router.push(`/app/saved/${contentId}`);
      }}
      type="button"
    >
      <section className="text-left max-h-[250px] p-4 shadow-inner">
        {(() => {
          if (gptGenerated !== null) {
            const parseJson = JSON.parse(gptGenerated);

            let summary: any[] = [];
            let headingOneCount: number = 0;

            for (const item of parseJson) {
              const { type, content } = item;

              if (type === 'heading_1') {
                if (headingOneCount < 1) {
                  summary.push({ type, content });
                }

                headingOneCount++;
              }

              if (headingOneCount < 2 && type === 'paragraph') {
                summary.push({ type, content });
              }
            }
            return summary.map((value, index) => {
              if (value.type === 'heading_1') {
                return (
                  <p className="text-lg font-bold" key={index}>
                    {value.content}
                  </p>
                );
              } else {
                return (
                  <p className="text-base font-normal" key={index}>
                    {value.content}
                  </p>
                );
              }
            });
          } else {
            return <p className="text-lg font-bold">No content yet</p>;
          }
        })()}
      </section>

      <section className="flex flex-col w-full h-fit items-start justify-center gap-0 bg-white text-onPrimaryContainer px-2 py-4">
        <p className="sm:max-w-[200px] max-w-[150px] truncate font-bold sm:text-lg text-base">
          {title ?? 'No Title'}
        </p>
        <p className="font-light text-base sm:block hidden">
          {moment(date).format('MMMM DD, YYYY HH:mm')}
        </p>

        <p className="font-light text-xs sm:hidden block">
          {moment(date).format('MM/DD/YY')}
        </p>
      </section>
    </button>
  );
};

export default OneContentGalleryView;
