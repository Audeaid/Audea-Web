'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import LoadingContent from '@/components/LoadingContent'
import {
  createNewContent,
  generateNotionPage,
  getNotionAccount,
  getNotionTitleName,
  getS3PresignedPost,
  getTypeOfPrompt,
  publicGetGptResponse,
  publicGetTranscriptFromWhisper,
  updateContent,
  uploadVoiceNoteToS3,
} from './script'
import { IGetContentSettings } from '../graphql'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'
import Link from 'next/link'
import UploadAndRecord from './UploadAndRecord'
import ErrorToast from '@/components/ErrorToast'
import AddLottieAnimation from '@/components/AddLottieAnimation'

interface Props {
  hasContent: boolean
  token: string
  contentSettings: IGetContentSettings
}

export default function Client({ hasContent, token, contentSettings }: Props) {
  const router = useRouter()
  const [condition, setCondition] = useState('inactive')
  const [isUploading, setIsUploading] = useState(false)
  const [isError, setIsError] = useState(false)

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [userContentSettings, _setUserContentSettings] = useState(contentSettings)

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [bearerToken, _setBearerToken] = useState(token)

  return (
    <motion.section
      className='w-full h-full min-h-screen'
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => event.preventDefault()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className='select-none mt-10 pb-10 sm:px-10 px-4 max-w-[1300px] mx-auto'>
        <section className='flex flex-col gap-4 items-center justify-center'>
          <h4 className='sm:text-lg text-base font-light text-center'>
            Upload your voice record or record it. Audea will do its magic.
          </h4>
          {hasContent ? (
            <Link href='/app/saved'>
              <Button variant='outline' className={cn('w-fit h-fit')}>
                See your saved notes
              </Button>
            </Link>
          ) : (
            <Link href='/app/how-audea-works'>
              <Button variant='outline' className={cn('w-fit h-fit')}>
                See how to use Audea
              </Button>
            </Link>
          )}
        </section>

        <section>
          {(() => {
            if (isUploading) {
              if (isError) {
                return (
                  <section className='w-full h-fit border-dashed border-2 border-border rounded-xl py-20 max-w-[800px] mx-auto relative sm:px-0 px-4 dark:bg-gray-900 bg-gray-100 flex flex-col items-center justify-center mt-10'>
                    <div className='max-w-[300px]'>
                      <AddLottieAnimation
                        animationConfig={{ path: '/lottie/91878-bouncy-fail.json', loop: false, autoplay: true }}
                      />
                    </div>
                    <p className='font-bold sm:text-2xl text-lg text-center'>There is an error generating your note</p>
                  </section>
                )
              } else {
                return <LoadingContent condition={condition} />
              }
            } else {
              return (
                <UploadAndRecord
                  onFileUpload={(file, outputLanguage, writingStyle, typeOfPromptId) => {
                    const fetchMain = async () => {
                      setIsUploading(true)

                      if (
                        outputLanguage === 'ASK' ||
                        writingStyle === 'ASK' ||
                        typeOfPromptId === '647391c118e8a4e1170d3ec9'
                      ) {
                        throw new Error('Somewhere, there is an error because the data is invalid')
                      }

                      try {
                        // First, create new content
                        setCondition('Creating new database...')
                        const content = await createNewContent(token)

                        // Get typeOfPrompt
                        setCondition('Getting prompt from our database...')
                        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId)
                        if (typeOfPrompt === null) throw new Error('typeOfPrompt is null')

                        await updateContent({
                          token,
                          contentId: content.id,
                          title: null,
                          voiceNoteUrl: null,
                          transcript: null,
                          gptGenerated: null,
                          typeOfPromptId: typeOfPromptId,
                          writingStyle: writingStyle,
                          outputLanguage: outputLanguage,
                        })

                        // Upload the voice note to s3 using contentId
                        setCondition('Uploading the audio file...')
                        const url = await getS3PresignedPost(
                          content.id,
                          file.type,
                          file.name.substring(file.name.lastIndexOf('.')),
                        )

                        if (!url) throw new Error('Error getting the url')

                        const location = await uploadVoiceNoteToS3(file, url)

                        await updateContent({
                          token,
                          contentId: content.id,
                          title: null,
                          voiceNoteUrl: location,
                          transcript: null,
                          gptGenerated: null,
                          typeOfPromptId: null,
                          writingStyle: null,
                          outputLanguage: null,
                        })

                        // Get the transcript from whisper
                        setCondition('Getting the transcript...')
                        const transcript = await publicGetTranscriptFromWhisper(file)
                        await updateContent({
                          token,
                          contentId: content.id,
                          title: null,
                          voiceNoteUrl: null,
                          transcript: transcript.text,
                          gptGenerated: null,
                          typeOfPromptId: null,
                          writingStyle: null,
                          outputLanguage: null,
                        })

                        // Get chatGPT response
                        setCondition('Transcript is being analyzed by AI...')
                        const systemPrompt = typeOfPrompt.systemPrompt
                        const userPrompt = `Audio transcription:
                    ${transcript.text}
                    Output language: ${outputLanguage === 'TRANSCRIPT' ? 'Same as transcript' : outputLanguage}
                    Writing style: ${writingStyle}`

                        const gptResponse = await publicGetGptResponse(systemPrompt, userPrompt)

                        // Parsing the response
                        setCondition('Parsing AI response...')
                        const actualGptResponse = gptResponse.choices[0].message.content
                        const jsonGptResponse = JSON.parse(actualGptResponse)

                        let title = ''
                        for (const obj of jsonGptResponse) {
                          if (obj.type === 'title') {
                            title = obj.content
                            break
                          }
                        }

                        const response = await updateContent({
                          token,
                          contentId: content.id,
                          title: title,
                          voiceNoteUrl: null,
                          transcript: null,
                          gptGenerated: actualGptResponse,
                          typeOfPromptId: null,
                          writingStyle: null,
                          outputLanguage: null,
                        })

                        // Parsing the response
                        setCondition('Get integration preferences...')

                        const notion = await getNotionAccount(token)

                        if (notion !== null) {
                          if (notion.primaryDatabase !== null) {
                            if (notion.automaticPost) {
                              setCondition('Posting note to Notion...')

                              setCondition('Notion: getting the title property name...')
                              const { response: titleProperties } = await getNotionTitleName(token)

                              setCondition('Notion: getting the title property name...')
                              await generateNotionPage(token, response.id, titleProperties)
                            }
                          }
                        }

                        router.push(`/app/saved/${response.id}`)
                      } catch (error) {
                        setIsError(true)
                        ErrorToast({ action: 'generating content', error })
                      }
                    }

                    fetchMain()
                  }}
                  contentSettings={userContentSettings}
                  token={bearerToken}
                />
              )
            }
          })()}
        </section>
      </section>
    </motion.section>
  )
}