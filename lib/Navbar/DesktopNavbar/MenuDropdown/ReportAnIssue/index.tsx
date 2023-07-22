'use client'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuDialogItem } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bug, MailCheck } from 'lucide-react'
import cn from '@/utils/cn'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { pushIssue } from './script'
import ErrorToast from '@/components/ErrorToast'

interface Props {
  token: string
}

const ReportAnIssue = ({ token }: Props) => {
  const [issueSubmitted, setIssueSubmitted] = useState(false)

  return (
    <DropdownMenuDialogItem
      trigger={
        <>
          <Bug className='mr-2 h-4 w-4' />
          <span>Report an issue</span>
        </>
      }
    >
      <DialogContent className='sm:max-w-[425px] select-none'>
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>
            What area are you having problems with? Please gives us as much information as possible. Please also beware
            of sensitive information.
          </DialogDescription>
        </DialogHeader>
        <form
          className={cn('flex flex-col gap-4')}
          onSubmit={async (e) => {
            e.preventDefault()

            const formData = new FormData(e.currentTarget)

            const areaForm = formData.get('area')
            const severityLevelForm = formData.get('severity-level')
            const subjectForm = formData.get('subject')
            const descriptionForm = formData.get('description')

            if (areaForm !== null && severityLevelForm !== null && subjectForm !== null && descriptionForm !== null) {
              toast
                .promise(
                  pushIssue({
                    token,
                    area: areaForm.toString(),
                    severityLevel: severityLevelForm.toString(),
                    subject: subjectForm.toString(),
                    description: descriptionForm.toString(),
                  }),
                  {
                    loading: 'Submitting your issue...',
                    success: 'Success submitting your issue!',
                    error: 'Error submitting your issue!',
                  },
                )
                .then(() => {
                  setIssueSubmitted(true)
                })
                .catch((e) => {
                  ErrorToast({ action: 'submitting issue form', error: e })
                })
            }
          }}
        >
          <div className='py-4 flex flex-col gap-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='area'>Area</Label>
                <Select name='area' required={true}>
                  <SelectTrigger id='area'>
                    <SelectValue placeholder='Select area' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='account'>Account</SelectItem>
                    <SelectItem value='integration'>Integration</SelectItem>
                    <SelectItem value='billing'>Billing</SelectItem>
                    <SelectItem value='bug'>Bug</SelectItem>
                    <SelectItem value='other'>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='severity-level'>Severity Level</Label>
                <Select name='severity-level' required={true}>
                  <SelectTrigger id='severity-level'>
                    <SelectValue placeholder='Select level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>Severity 1 (Highest)</SelectItem>
                    <SelectItem value='2'>Severity 2</SelectItem>
                    <SelectItem value='3'>Severity 3 (Medium)</SelectItem>
                    <SelectItem value='4'>Severity 4</SelectItem>
                    <SelectItem value='5'>Severity 5 (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='subject'>Subject</Label>
              <Input id='subject' placeholder='I need help with...' name='subject' required={true} />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='description'>Description</Label>
              <Textarea
                id='description'
                placeholder='Please include all information relevant to your issue.'
                name='description'
                required={true}
              />
            </div>
          </div>

          <div className='flex w-full items-center justify-end'>
            <Button type='submit'>Submit</Button>
          </div>
        </form>

        {issueSubmitted && (
          <Alert>
            <MailCheck className='h-4 w-4 mr-2' />
            <AlertTitle>Your issue has been submitted!</AlertTitle>
            <AlertDescription>
              You&apos;ll get confirmation email shortly. And the Audea team will get in touch!
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </DropdownMenuDialogItem>
  )
}

export default ReportAnIssue
