'use client'

import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { Separator } from '@/components/ui/separator'
import cn from '@/utils/cn'

export default function ErrorSafariContentBlocker(isSafari: boolean) {
  if (isSafari) {
    return toast(
      (t) => (
        <div className='flex flex-col items-center justify-center w-full gap-4'>
          <div className='flex flex-col items-center justify-center gap-2'>
            <p>
              <FontAwesomeIcon icon={faXmarkCircle} className='text-destructive mr-2' size='lg' />
              Error occurred while loading script for live chat.
            </p>
            <Separator />
          </div>

          <p className='text-justify'>
            This is most likely caused by a <strong>content blocker</strong> since you are detected using Safari. You
            can try again using a different browser. If you urgently need support, please chat us on Slack located in
            the menu bar.
          </p>

          <Button onClick={() => toast.dismiss(t.id)} size={'default'} variant={'destructive'} className={cn('w-full')}>
            Dismiss
          </Button>
        </div>
      ),
      { duration: Infinity, position: 'top-center' },
    )
  } else {
    return null
  }
}
