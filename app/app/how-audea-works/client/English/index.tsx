'use client'

import { Badge } from '@/components/ui/badge'
import cn from '@/utils/cn'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import { Copy, Printer, Siren } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { outputLanguageList } from '@/app/data/outputLanguage'
import { inputLanguage } from '@/app/data/inputLanguage'
import { NOTE_EXAMPLE_URL } from '@/utils/constant'

export default function English() {
  const lastUpdateDate = moment('2023-07-01') // change here after updating

  const currentDate = moment()
  const daysAgo = currentDate.diff(lastUpdateDate, 'days')

  return (
    <motion.section
      className='lg:grid lg:grid-cols-[1fr_0.25fr] print:text-black select-none print:bg-white'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <section className='flex flex-col gap-12'>
        <section className='flex flex-col gap-4'>
          <header className='flex flex-col gap-2'>
            <h1 className='font-bold text-4xl'>How to use Audea</h1>
            <Badge className={cn('w-fit h-fit')} variant='outline'>
              Last updated: {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
            </Badge>
          </header>
        </section>

        <p className='text-justify'>
          At Audea, our goal is to simplify the process of transforming your messy thoughts into structured notes.
          Here&apos;s a step-by-step breakdown of how to use Audea:
        </p>

        <section className='flex flex-col gap-2'>
          <header className='flex flex-col gap-1 bg-foreground text-background p-2 print:p-0'>
            <h2 className='text-xl scroll-m-10' id='step-1'>
              <strong>Step 1</strong> | Recording or uploading your voice
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className='text-justify'>At Audea, there is two method you can use. You can use either:</p>

          <ol className='list-decimal list-outside ml-4 flex flex-col gap-2'>
            <li>Recording: Simply click the record button and start speaking freely, or</li>

            <li>
              Uploading audio file: You can browse or just drag and drop files in formats like MP3, MP4, MP4A, MPGA,
              WAV, or MPEG. Audea will convert your selected files
            </li>
          </ol>

          <p className='text-justify'>
            Audea can detect {inputLanguage.length} languages from your audio. These languages are:{' '}
            {inputLanguage.join(', ')}.
          </p>

          <p className='text-justify'>
            When you use Audea for the first time, you need to configure on how you want the generated note will be.
          </p>

          <Alert className={cn('print:text-black print:border-black print:bg-gray-500')}>
            <Siren className='h-4 w-4' />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              As of today ({currentDate.format('DD MMMM YYYY')}), you can&apos;t use the recording feature on the Safari
              browser.
            </AlertDescription>
          </Alert>
        </section>

        <section className='flex flex-col gap-2'>
          <header className='flex flex-col gap-1 bg-foreground text-background p-2 print:p-0'>
            <h2 className='text-xl scroll-m-10' id='step-2'>
              <strong>Step 2</strong> | Customizing your desired note
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className='text-justify'>Initially, you need to configure 3 things to make your new note with Audea:</p>

          <ol className='list-decimal list-outside ml-4 flex flex-col gap-2'>
            <li>
              <strong>The output language</strong>. You can set this as &quot;Same as transcript&quot; or, you can
              choose the desired output language. For now, the supported output languages are:{' '}
              {outputLanguageList
                .filter((v) => v.db !== 'TRANSCRIPT')
                .map((v) => v.label)
                .filter((_v, i) => i !== outputLanguageList.length - 2)
                .join(', ')}
              , and {outputLanguageList[outputLanguageList.length - 1].label}.
            </li>

            <li>
              <strong>Writing style</strong>. Since Audea uses AI to transform your audio into notes, you can choose any
              writing style you want. You can always choose the &quot;Default&quot; if you don&apos;t preferred any
              writing style. Please note that writing style is not 100% effective when the output language is not
              English.
            </li>

            <li>
              <strong>Type of note</strong>. We have a wide range of note to choose from, depending on your needs. To
              see all the examples, please click{' '}
              <a href={NOTE_EXAMPLE_URL} className='underline' target='_blank' rel='noreferrer'>
                here
              </a>
              .
            </li>
          </ol>

          <p className='text-justify'>
            You can always tick the &quot;Don&apos;t ask me again&quot; checkbox and change your saved preferences{' '}
            <a href='/app/settings' className='underline'>
              here
            </a>
            .
          </p>
        </section>

        <section className='flex flex-col gap-2'>
          <header className='flex flex-col gap-1 bg-foreground text-background p-2 print:p-0'>
            <h2 className='text-xl scroll-m-10' id='step-3'>
              <strong>Step 3</strong> | Generating and saving your note
            </h2>
            <Separator className={cn('print:text-black print:bg-black')} />
          </header>

          <p className='text-justify'>
            Audea will automatically processed your audio based on your selected preferences. A loading screen will be
            shown (with the respective text) to indicate that the note is still being generated.
          </p>

          <p className='text-justify'>
            Please (and this is very important) don&apos;t ever close the window or your browser when the note is still
            being generated. Generating note could take seconds up until 1 hour (depending on how long and complex your
            audio is).
          </p>

          <p className='text-justify'>
            Your new note will be automatically saved, along with your transcription and your audio files.
          </p>
        </section>

        <section className='flex flex-col gap-2 print:hidden'>
          <header className='flex flex-col gap-1'>
            <h2 className='text-3xl font-bold scroll-m-10' id='watch-tutorial'>
              Watch tutorial
            </h2>
            <Separator />
          </header>

          <div className='max-w-[450px]'>
            <AspectRatio ratio={16 / 9}>
              <div
                style={{
                  position: 'relative',
                  paddingBottom: '62.5%',
                  height: 0,
                }}
              >
                <iframe
                  src='https://www.loom.com/embed/45689b82453b4f2caf95444fb4bf6ee8?sid=7c74d624-1c3b-4961-9319-fca376cf9433'
                  allowFullScreen={true}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </AspectRatio>
          </div>
        </section>

        <section className='flex md:flex-row flex-col flex-wrap gap-4 my-10 print:hidden'>
          <Button
            variant='outline'
            className={cn('w-fit h-fit')}
            onClick={() => {
              window.print()
            }}
          >
            <Printer className='mr-2 w-4 h-4' />
            Print
          </Button>

          <Button
            variant='outline'
            className={cn('w-fit h-fit')}
            onClick={() => {
              const url = 'https://app.audea.id/app/how-audea-works'
              toast.promise(navigator.clipboard.writeText(url), {
                loading: 'Copying link...',
                success: 'Link copied!',
                error: 'Error copying link!',
              })
            }}
          >
            <Copy className='mr-2 w-4 h-4' />
            Copy link
          </Button>
        </section>
      </section>

      <section className='lg:flex hidden flex-col gap-4 w-fit h-fit justify-self-end sticky print:hidden'>
        <p className='print:hidden'>On this page</p>
        <section className='flex flex-col gap-1'>
          <a className='text-muted-foreground hover:text-foreground cursor-pointer print:hidden' href='#step-1'>
            Step 1
          </a>

          <a className='text-muted-foreground hover:text-foreground cursor-pointer print:hidden' href='#step-2'>
            Step 2
          </a>

          <a className='text-muted-foreground hover:text-foreground cursor-pointer print:hidden' href='#step-3'>
            Step 3
          </a>

          <a className='text-muted-foreground hover:text-foreground cursor-pointer print:hidden' href='#watch-tutorial'>
            Watch tutorial
          </a>
        </section>
      </section>
    </motion.section>
  )
}
