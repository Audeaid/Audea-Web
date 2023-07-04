'use client';

export const SummariseMyThoughts = ({
  content,
  dir,
}: {
  content: any[];
  dir: 'rtl' | 'ltr';
}) => {
  return (
    <article className="flex flex-col gap-8" dir={dir}>
      {content.map((v, i) => {
        if (v.type !== 'title') {
          return (
            <p key={i} className="text-justify">
              {v.content}
            </p>
          );
        }
      })}
    </article>
  );
};
