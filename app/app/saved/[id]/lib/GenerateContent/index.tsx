'use client'

import LoadingContent from '@/components/LoadingContent'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddLottieAnimation from '@/components/AddLottieAnimation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import ErrorToast from '@/components/ErrorToast'
import { Button } from '@/components/ui/button'
import {
  getTypeOfPrompt,
  publicGetGptResponse,
  publicGetTranscriptFromWhisper,
  updateContent,
} from '@/app/app/client/script'
import { downloadAudioFileFromS3 } from './script'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { deleteContent } from '../ErrorShouldDelete/script'

interface Props {
  token: string
  contentId: string
  s3ObjectName: string
  typeOfPromptId: string
  transcript: string | null
  gptGenerated: string | null
  writingStyle: string
  outputLanguage: string
}

export default function GenerateContent({
  token,
  contentId,
  s3ObjectName,
  typeOfPromptId,
  transcript,
  gptGenerated,
  writingStyle,
  outputLanguage,
}: Props) {
  const router = useRouter()
  const [condition, setCondition] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const handleClick = async () => {
    if (transcript === null && gptGenerated === null) {
      try {
        setIsUploading(true)

        setCondition('Downloading your audio file...')
        const file = await downloadAudioFileFromS3(s3ObjectName)

        setCondition('Getting the transcript...')
        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId)
        if (!typeOfPrompt) throw new Error('typeOfPrompt is null')

        const whisperData = await publicGetTranscriptFromWhisper(file)
        await updateContent({
          token,
          contentId,
          transcript: whisperData.text,
        })

        setCondition('Transcript is being analyzed by AI...')
        const systemPrompt = typeOfPrompt.systemPrompt
        const userPrompt = `Audio transcription:
        ${whisperData.text}
        Output language: ${outputLanguage === 'TRANSCRIPT' ? 'Same as transcript' : outputLanguage}
        Writing style: ${writingStyle}`

        const gptResponse = await publicGetGptResponse(systemPrompt, userPrompt)

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
          contentId,
          title: title,
          gptGenerated: actualGptResponse,
        })

        router.push(`/app/saved/${response.id}`)
      } catch (error) {
        ErrorToast({ action: 'generating content', error })
        setIsUploading(false)
      }
    }

    if (gptGenerated === null && transcript !== null) {
      try {
        setIsUploading(true)

        setCondition('Transcript is being analyzed by AI...')
        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId)
        if (!typeOfPrompt) throw new Error('typeOfPrompt is null')

        const systemPrompt = typeOfPrompt.systemPrompt
        const userPrompt = `Audio transcription:
        ${transcript}
        Output language: ${outputLanguage === 'TRANSCRIPT' ? 'Same as transcript' : outputLanguage}
        Writing style: ${writingStyle}`

        const gptResponse = await publicGetGptResponse(systemPrompt, userPrompt)

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
          contentId,
          title: title,
          gptGenerated: actualGptResponse,
        })

        router.push(`/app/saved/${response.id}`)
      } catch (error) {
        ErrorToast({ action: 'generating content', error })
        setIsUploading(false)
      }
    }
  }

  return (
    <>
      {isUploading ? (
        <LoadingContent condition={condition} />
      ) : (
        <motion.section
          className='flex flex-col gap-4 w-fit mx-auto items-center justify-center select-none'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className='max-w-[500px] w-fit'>
            <AddLottieAnimation
              animationConfig={{ path: '/lottie/46864-lovely-cats.json', loop: true, autoplay: true }}
            />
          </div>
          <section className='mt-[-5rem] flex flex-col gap-8 items-center justify-center'>
            <section className='flex flex-col gap-2 text-center'>
              <p className='font-bold text-xl max-w-[600px] mx-auto'>
                Sorry, it seems like there is an error while generating your note.
              </p>
              <p className='text-center font-light'>
                We have your audio file
                {transcript === null
                  ? ", but we don't have the transcript"
                  : ' and your transcript, but there is an error generating the note'}
                . Please click the button below to retry.
              </p>
            </section>

            <section className='flex flex-col gap-4 items-center justify-center'>
              <Button onClick={handleClick} type='button'>
                <FontAwesomeIcon icon={faArrowRotateRight} className='mr-2' />
                Retry generating note
              </Button>

              <Button
                variant='secondary'
                type='button'
                onClick={() => {
                  toast
                    .promise(axios.post('/api/s3/getObject', { s3ObjectName }), {
                      loading: 'Getting the downloadable url...',
                      success: 'Success getting the downloadable url!',
                      error: 'Error getting the downloadable url!',
                    })
                    .then(({ data }) => {
                      toast
                        .promise(fetch(data), {
                          loading: 'Fetching the downloadable url...',
                          success: 'Success fetching the downloadable url!',
                          error: 'Error fetching the downloadable url!',
                        })
                        .then((response) => {
                          toast
                            .promise(response.blob(), {
                              loading: 'Blobing the downloadable url...',
                              success: 'Success blobing the downloadable url!',
                              error: 'Error blobing the downloadable url!',
                            })
                            .then((blob) => {
                              const url = URL.createObjectURL(blob)
                              const downloadLink = document.createElement('a')
                              downloadLink.href = url
                              downloadLink.download = s3ObjectName // This attribute triggers the download.

                              // Append the link to the document and immediately click it to download the file.
                              document.body.appendChild(downloadLink)
                              downloadLink.click()

                              // Clean up the URL and remove the link after the download is initiated.
                              URL.revokeObjectURL(url)
                              document.body.removeChild(downloadLink)
                            })
                            .catch((error) => {
                              ErrorToast({ action: 'blobing the downloadable url', error })
                            })
                        })
                        .catch((error) => {
                          ErrorToast({ action: 'fetching the downloadable url', error })
                        })
                    })
                    .catch((error) => {
                      ErrorToast({ action: 'getting the downloadable url', error })
                    })
                }}
              >
                <Download className='mr-2 w-4 h-4' />
                Download your audio file
              </Button>

              <Button
                onClick={() => {
                  toast
                    .promise(deleteContent(token, contentId), {
                      loading: 'Deleting your note...',
                      success: 'Success deleting your note!',
                      error: 'Error deleting your note!',
                    })
                    .then(() => {
                      router.push('/app/saved')
                    })
                    .catch((error) => {
                      ErrorToast({ action: 'deleting your note', error })
                    })
                }}
                type='button'
                variant='destructive'
              >
                <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />
                Delete this note and go back
              </Button>
            </section>
          </section>
        </motion.section>
      )}
    </>
  )
}
