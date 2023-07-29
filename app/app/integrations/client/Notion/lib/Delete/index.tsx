'use client'

import cn from '@/utils/cn'
import { Button } from '@/components/ui/button'
import ErrorToast from '@/components/ErrorToast'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { deleteNotionConnection } from '@/app/app/integrations/[...connections]/lib/Notion/script'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  token: string
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
}

export default function Delete({ token, dialogOpen, setDialogOpen }: Props) {
  const router = useRouter()

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className={cn('select-none')}>
        <DialogHeader>
          <DialogTitle>Delete your Notion integration</DialogTitle>
        </DialogHeader>

        <section className='space-y-8'>
          <section className='space-y-2'>
            <p>Are you sure you want to remove your Notion integration?</p>
            <p className={cn('text-muted-foreground text-sm')}>You can always connect it again later.</p>
          </section>

          <section className='md:grid md:grid-cols-2 md:gap-4 flex flex-col items-center justify-center gap-2 flex-wrap'>
            <Button variant='outline' className={cn('w-full h-fit')} onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              className={cn('w-full h-fit')}
              onClick={() => {
                toast
                  .promise(deleteNotionConnection(token), {
                    loading: 'Deleting your notion connection...',
                    success: 'Notion account deleted!',
                    error: 'Error deleting your notion connection!',
                  })
                  .then(() => {
                    setDialogOpen(false)
                    router.push('/app/integrations')
                  })
                  .catch((error) => {
                    ErrorToast({ action: 'deleting your notion connection', error })
                  })
              }}
            >
              Delete
            </Button>
          </section>
        </section>
      </DialogContent>
    </Dialog>
  )
}
