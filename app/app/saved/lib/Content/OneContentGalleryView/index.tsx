'use client';

import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

const OneContentGalleryView = ({
  contentId,
  title,
  date,
  gptGenerated,
}: {
  contentId: string;
  title: string | null;
  gptGenerated: string | null;
  date: string;
}) => {
  return (
    <a
      href={`/app/saved/${contentId}`}
      className="cursor-pointer overflow-hidden rounded-lg h-full min-h-[336px] max-h-[336px] w-full border border-border"
    >
      <section className="text-left max-h-[250px] p-4 shadow-inner bg-secondary text-secondary-foreground w-full min-h-[250px] overflow-hidden">
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

      <section className="flex flex-col w-full h-fit items-start justify-center gap-0 px-2 py-4 bg-primary text-primary-foreground border-2 border-ring rounded-b-lg">
        <section className="flex items-center justify-center gap-2 font-medium sm:text-lg text-base w-full max-w-full truncate">
          <FontAwesomeIcon icon={faNewspaper} />
          <p className="w-full max-w-full truncate">{title ?? 'No Title'}</p>
        </section>

        <p className="font-light text-base">
          {moment(date).format('MMMM DD, YYYY HH:mm')}
        </p>
      </section>
    </a>
  );
};

export default OneContentGalleryView;
