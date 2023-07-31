'use client'

import { outputLanguageList } from '@/app/data/outputLanguage'
import { prompt } from '@/app/data/typeOfPrompt'
import { Separator } from '@/components/ui/separator'

interface Props {
  outputLanguage: string
  writingStyle: string
  typeOfPromptId: string
}

export default function Footer({ outputLanguage, writingStyle, typeOfPromptId }: Props) {
  return (
    <footer className='flex flex-col gap-4 select-none print:hidden'>
      <Separator />

      <section className='flex justify-between items-center flex-wrap text-sm text-muted-foreground gap-2'>
        <p>Output language: {outputLanguageList.find((v) => v.db === outputLanguage)?.label}</p>

        <p>Writing style: {writingStyle}</p>

        <p>Type of prompt: {prompt.find((v) => v.id === typeOfPromptId)?.name}</p>
      </section>
    </footer>
  )
}
