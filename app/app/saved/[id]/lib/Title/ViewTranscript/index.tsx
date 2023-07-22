'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'
import { X } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { getTypeOfPrompt, publicGetGptResponse, updateContent } from './script'
import ErrorToast from '@/components/ErrorToast'
import LoadingContent from '@/components/LoadingContent'

export default function ViewTranscript({
  open,
  setOpen,
  token,
  contentId,
  typeOfPromptId,
  transcript,
  outputLanguage,
  writingStyle,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  transcript: string
  token: string
  contentId: string
  typeOfPromptId: string
  outputLanguage: string
  writingStyle: string
}) {
  const [edit, setEdit] = useState(false)
  const [value, setValue] = useState(transcript)
  const [regeneratingContent, setRegeneratingContent] = useState(false)

  const [condition, setCondition] = useState('')

  useEffect(() => {
    ;(async () => {
      if (regeneratingContent) {
        try {
          setCondition('Updating new transcript...')
          await updateContent({ token, contentId, transcript: value })

          setCondition('Getting your preferred settings...')
          const typeOfPrompt = await getTypeOfPrompt(token, typeOfPromptId)

          if (!typeOfPrompt) throw new Error('typeOfPrompt is null')

          setCondition('Regenerating new content...')
          const systemPrompt = typeOfPrompt.systemPrompt
          const userPrompt = `Audio transcription:
                  ${value}
                  Output language: ${outputLanguage === 'TRANSCRIPT' ? 'Same as transcript' : outputLanguage}
                  Writing style: ${writingStyle}`

          const response = await publicGetGptResponse(systemPrompt, userPrompt)

          setCondition('Parsing AI response...')
          const actualGptResponse = response.choices[0].message.content
          const jsonGptResponse = JSON.parse(actualGptResponse)

          let title = ''
          for (const obj of jsonGptResponse) {
            if (obj.type === 'title') {
              title = obj.content
              break
            }
          }

          await updateContent({
            token,
            contentId,
            title,
            gptGenerated: actualGptResponse,
          })

          window.location.reload()
        } catch (error) {
          setValue(transcript)
          setEdit(false)
          setOpen(false)
          ErrorToast('regenerating content', error)
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regeneratingContent])

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        if (v) {
          setOpen(true)
        } else {
          setEdit(false)
          setValue(transcript)
          setOpen(false)
        }
      }}
    >
      {regeneratingContent ? (
        <AlertDialogContent>
          <LoadingContent condition={condition} />
        </AlertDialogContent>
      ) : (
        <AlertDialogContent className='relative'>
          {edit && (
            <div className='w-full h-fit absolute inset-0 flex items-center justify-center'>
              <p className='w-fit h-fit rounded-b-md px-1 py-0.5 text-xs bg-destructive text-destructive-foreground border'>
                You are editing transcript
              </p>
            </div>
          )}

          <AlertDialogHeader className={cn('flex flex-row items-center justify-between')}>
            <AlertDialogTitle className={cn('w-fit h-fit')}>Generated transcript</AlertDialogTitle>

            <AlertDialogCancel className={cn('w-fit h-fit p-2')}>
              <X />
            </AlertDialogCancel>
          </AlertDialogHeader>

          {edit ? (
            <form
              className='flex flex-col gap-4'
              onSubmit={(e) => {
                e.preventDefault()

                setRegeneratingContent(true)
              }}
            >
              <Textarea
                className='h-72 w-full rounded-md border p-4'
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                name='transcript'
                required={true}
                autoFocus={true}
              />

              <AlertDialogFooter>
                <Button
                  variant='outline'
                  onClick={() => {
                    setValue(transcript)
                    setEdit(false)
                  }}
                  type='button'
                >
                  Cancel
                </Button>

                <Button type='submit'>Save</Button>
              </AlertDialogFooter>
            </form>
          ) : (
            <>
              <ScrollArea className='h-72 w-full rounded-md border p-4'>{transcript}</ScrollArea>

              <AlertDialogFooter>
                <Button onClick={() => setEdit(true)}>Edit</Button>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      )}
    </AlertDialog>
  )
}
