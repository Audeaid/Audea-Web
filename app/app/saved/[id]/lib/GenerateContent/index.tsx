'use client'

import { getTranscriptViaWhisperFromUrl, getTypeOfPrompt, publicGetGptResponse, updateContent } from './script'
import LoadingContent from '@/components/LoadingContent'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AddLottieAnimation from '@/components/AddLottieAnimation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import ErrorToast from '@/components/ErrorToast'
import { Button } from '@/components/ui/button'

const GenerateContent = ({
  token,
  contentId,
  voiceNoteUrl,
  typeOfPromptId,
  transcript,
  gptGenerated,
  writingStyle,
  outputLanguage,
}: {
  token: string
  contentId: string
  voiceNoteUrl: string
  typeOfPromptId: string
  transcript: string | null
  gptGenerated: string | null
  writingStyle: string
  outputLanguage: string
}) => {
  const router = useRouter()
  const [condition, setCondition] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const handleClick = async () => {
    if (transcript === null && gptGenerated === null) {
      setIsUploading(true)

      try {
        setCondition('Getting the transcript...')
        const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId)
        if (!typeOfPrompt) throw new Error('typeOfPrompt is null')

        const whisperData = await getTranscriptViaWhisperFromUrl(voiceNoteUrl)
        await updateContent({
          token,
          contentId,
          title: null,
          voiceNoteUrl: null,
          transcript: whisperData.text,
          gptGenerated: null,
          typeOfPromptId: null,
          outputLanguage: null,
          writingStyle: null,
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
          voiceNoteUrl: null,
          transcript: null,
          gptGenerated: actualGptResponse,
          typeOfPromptId: null,
          outputLanguage: null,
          writingStyle: null,
        })

        router.push(`/app/saved/${response.id}`)
      } catch (error) {
        ErrorToast('generating content', error)
        setIsUploading(false)
      }
    }

    if (gptGenerated === null && transcript !== null) {
      setIsUploading(true)

      try {
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
          voiceNoteUrl: null,
          transcript: null,
          gptGenerated: actualGptResponse,
          typeOfPromptId: null,
          outputLanguage: null,
          writingStyle: null,
        })

        router.push(`/app/saved/${response.id}`)
      } catch (error) {
        ErrorToast('generating content', error)
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
            <AddLottieAnimation path={'/lottie/46864-lovely-cats.json'} loop={true} />
          </div>
          <section className='mt-[-5rem] flex flex-col gap-8 items-center justify-center'>
            <section className='flex flex-col gap-2'>
              <p className='font-bold text-xl max-w-[600px] text-center'>
                Sorry, it seems like there is an error while generating your transcript and or content.
              </p>
              <p className='text-center font-light'>Please click the button below to retry.</p>
            </section>
            <Button onClick={handleClick} type='button'>
              <FontAwesomeIcon icon={faArrowRotateRight} className='mr-2' />
              Retry generating content
            </Button>
          </section>
        </motion.section>
      )}
    </>
  )
}

export default GenerateContent
