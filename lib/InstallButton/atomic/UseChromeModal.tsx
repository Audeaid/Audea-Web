'use client'

import { Dispatch, SetStateAction } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import cn from '@/utils/cn'

export function UseChromeModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className={cn('select-none')}>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsupported browser</AlertDialogTitle>
        </AlertDialogHeader>

        <p>
          Your browser is unsupported to install PWA on your Operating System. Please use <strong>Google Chrome</strong>{' '}
          instead.
        </p>
        <AlertDialogFooter>
          <AlertDialogAction>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
