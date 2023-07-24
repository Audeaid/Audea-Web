'use client'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any[]
  dir: 'rtl' | 'ltr'
}

export const SummariseMyThoughts = ({ content, dir }: Props) => {
  return (
    <article className='flex flex-col gap-8' dir={dir}>
      {content.map((v, i) => {
        if (v.type !== 'title') {
          return (
            <p key={i} className='text-justify'>
              {v.content}
            </p>
          )
        }
      })}
    </article>
  )
}
