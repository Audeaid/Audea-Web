'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import cn from '@/utils/cn'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { deleteAllContent } from '../../script'
import ErrorToast from '@/components/ErrorToast'
import { useUser } from '@clerk/nextjs'
import { Skeleton } from '@/components/ui/skeleton'

export default function DeleteAllContent({ token }: { token: string }) {
  const [value, setValue] = useState('')
  const router = useRouter()

  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return (
      <section className='flex md:flex-row md:items-start md:justify-between flex-col items-start gap-4 flex-wrap'>
        <section className='flex flex-col gap-2'>
          <Skeleton className='w-40 h-8 rounded-full' />
          <Skeleton className='w-96 h-6 rounded-full' />
        </section>

        <Skeleton className='w-20 h-10 rounded-md' />
      </section>
    )
  }

  const valueToCheck = `Audea/${user.primaryEmailAddress?.emailAddress}`

  return (
    <section className='flex md:flex-row md:items-start md:justify-between flex-col items-start gap-4 flex-wrap'>
      <section className='flex flex-col gap-2'>
        <h3 className='text-2xl font-medium'>Delete all notes</h3>
        <p className='md:max-w-full max-w-[365px]'>Delete all notes you created with Audea.</p>
      </section>

      <Dialog>
        <DialogTrigger>
          <Button>Delete</Button>
        </DialogTrigger>
        <DialogContent className={cn('select-none')}>
          <DialogHeader>
            <DialogTitle>Delete all content</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <p>This will delete all content including your saved Audio files with Audea!</p>

          <form
            className='flex flex-col gap-2 mt-10'
            onSubmit={(e) => {
              e.preventDefault()

              toast
                .promise(deleteAllContent(token), {
                  loading: 'Deleting your content...',
                  success: 'All contents deleted!',
                  error: 'Error deleting your content!',
                })
                .catch((e) => {
                  ErrorToast('deleting your content', e)
                })

              router.push('/app')
            }}
          >
            <p>
              Please type <strong>{valueToCheck}</strong> to confirm.
            </p>
            <Input
              required={true}
              value={value}
              onChange={(e) => {
                setValue(e.currentTarget.value)
              }}
            />
            <Button
              variant='destructive'
              className={cn('w-full text-sm')}
              type='submit'
              disabled={value !== valueToCheck}
            >
              I understand the consequences, delete all content
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
