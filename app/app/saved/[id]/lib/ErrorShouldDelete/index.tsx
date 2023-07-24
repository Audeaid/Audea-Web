'use client'

import AddLottieAnimation from '@/components/AddLottieAnimation'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { motion } from 'framer-motion'
import { deleteContent } from './script'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Waves } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import ErrorToast from '@/components/ErrorToast'

interface Props {
  token: string
  contentId: string
  router: AppRouterInstance
}

export default function ErrorShouldDelete({ token, contentId, router }: Props) {
  const [loading, setLoading] = useState(false)

  return (
    <motion.section
      className='flex flex-col gap-4 w-fit mx-auto items-center justify-center select-none'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className='max-w-[500px] w-fit'>
        <AddLottieAnimation animationConfig={{ path: '/lottie/53034-lost.json', loop: true, autoplay: true }} />
      </div>
      <section className='mt-[-5rem] flex flex-col gap-12 items-center justify-center'>
        <section className='flex flex-col gap-6 max-w-[600px]'>
          <p className='font-bold text-xl text-center'>
            Sorry, it seems like there is a uncoverable error on our end that makes your audio cannot be processed.
          </p>

          <p className='text-center font-light'>
            It is very rare that we have an error like this and we are deeply sorry that this error happen to you.
          </p>

          <Alert>
            <Waves className='h-4 w-4' />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Please make sure that when we are processing your audio file, do not close the browser at any time, since
              it will interrupt the process.
            </AlertDescription>
          </Alert>
        </section>
        <Button
          onClick={async () => {
            try {
              setLoading(true)

              await deleteContent(token, contentId)

              router.push('/app/saved')

              setLoading(false)
            } catch (error) {
              setLoading(false)
              ErrorToast({ action: 'deleting note', error })
            }
          }}
          type='button'
        >
          {loading ? <LoadingSpinner size={4} /> : <FontAwesomeIcon icon={faArrowLeft} className='mr-2' />}
          Delete this content and go back
        </Button>
      </section>
    </motion.section>
  )
}
