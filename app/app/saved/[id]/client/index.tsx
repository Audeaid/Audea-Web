'use client'

import { IGetOneContent, IGetSharedContentByContentId } from '../graphql'
import ErrorShouldDelete from './ErrorShouldDelete'
import { useRouter } from 'next/navigation'
import GenerateContent from './GenerateContent'
import { BulletPointsWithSummary, SummariseMyThoughts } from '../view'
import Title from './Title'
import Footer from './Footer'

interface Props {
  content: IGetOneContent
  token: string
  id: string
  initialNotionPageUrl: string | null
  notionAccountConnected: boolean
  sharedContent: IGetSharedContentByContentId | null
}

export default function Client({
  content,
  token,
  id,
  initialNotionPageUrl,
  notionAccountConnected,
  sharedContent,
}: Props) {
  const router = useRouter()

  if (
    content.typeOfPromptId === null ||
    content.s3ObjectName === null ||
    content.outputLanguage === null ||
    content.writingStyle === null
  ) {
    return <ErrorShouldDelete token={token} contentId={id} router={router} />
  } else if (content.transcript === null || content.gptGenerated === null) {
    return (
      <GenerateContent
        token={token}
        contentId={content.id}
        s3ObjectName={content.s3ObjectName}
        typeOfPromptId={content.typeOfPromptId}
        transcript={content.transcript}
        gptGenerated={content.gptGenerated}
        writingStyle={content.writingStyle}
        outputLanguage={content.outputLanguage}
      />
    )
  } else {
    // content goes here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parseContent: any[] = JSON.parse(content.gptGenerated)

    return (
      <section className='flex flex-col gap-20'>
        <Title
          title={content.title ?? 'No title'}
          createdAt={content.createdAt}
          s3ObjectName={content.s3ObjectName}
          transcript={content.transcript}
          token={token}
          contentId={content.id}
          typeOfPromptId={content.typeOfPromptId}
          outputLanguage={content.outputLanguage}
          writingStyle={content.writingStyle}
          initialNotionPageUrl={initialNotionPageUrl}
          notionAccountConnected={notionAccountConnected}
          sharedContent={sharedContent}
        />

        <section className='print:text-black print:bg-white'>
          {(() => {
            if (content.typeOfPromptId === '646a2fc687e737835670b7b3') {
              return (
                <BulletPointsWithSummary
                  content={parseContent}
                  dir={content.outputLanguage === 'ARABIC' ? 'rtl' : 'ltr'}
                />
              )
            } else if (content.typeOfPromptId === '64a3da8642064a96db90e15e') {
              return (
                <SummariseMyThoughts content={parseContent} dir={content.outputLanguage === 'ARABIC' ? 'rtl' : 'ltr'} />
              )
            } else {
              return <></>
            }
          })()}
        </section>

        <Footer
          typeOfPromptId={content.typeOfPromptId}
          outputLanguage={content.outputLanguage}
          writingStyle={content.writingStyle}
        />
      </section>
    )
  }
}
