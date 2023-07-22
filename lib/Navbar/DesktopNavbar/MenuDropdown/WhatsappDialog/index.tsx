'use client'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenuDialogItem } from '@/components/ui/dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import cn from '@/utils/cn'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { capitalizeEveryWord, splitPhoneNumber } from '@/helper'
import { useReducer } from 'react'

type State = {
  whatsapp: string
  firstName: string
  lastName: string
}

type Action =
  | { type: 'CHANGE_WHATSAPP'; payload: string }
  | { type: 'CHANGE_FIRST_NAME'; payload: string }
  | { type: 'CHANGE_LAST_NAME'; payload: string }

interface Props {
  token: string
}

const WhatsappDialog = ({ token }: Props) => {
  const [state, dispatch] = useReducer(
    (state: State, action: Action): State => {
      switch (action.type) {
        case 'CHANGE_WHATSAPP':
          return { ...state, whatsapp: action.payload }
        case 'CHANGE_FIRST_NAME':
          return { ...state, firstName: action.payload }
        case 'CHANGE_LAST_NAME':
          return { ...state, lastName: action.payload }
        default:
          return state
      }
    },
    {
      whatsapp: '',
      firstName: '',
      lastName: '',
    },
  )

  const { whatsapp, firstName, lastName } = state

  const properWhatsapp = splitPhoneNumber(whatsapp)
  const properFirstName = capitalizeEveryWord(firstName)
  const properLastName = capitalizeEveryWord(lastName)

  const invitationLink = `https://app.audea.id/signup?firstName=${properFirstName}&lastName=${properLastName}&token=${token}`

  const text = `Hey ${properFirstName} ${properLastName}!👋🏼\n\nYou should try this app called Audea!\n\nI've been using this to convert my messy thoughts to structured notes, and I think you'd like it, too.\n\nYou can register with my referral link below:\n${invitationLink}`

  const waLink = `https://wa.me/${properWhatsapp}?text=${encodeURIComponent(text)}`

  return (
    <DropdownMenuDialogItem
      trigger={
        <>
          <FontAwesomeIcon icon={faWhatsapp} className='mr-2 h-4 w-4' />
          <span>WhatsApp</span>
        </>
      }
    >
      <DialogContent className='sm:max-w-[425px] select-none'>
        <DialogHeader>
          <DialogTitle>Invite your friends</DialogTitle>
          <DialogDescription>
            Send an invitation message to use Audea to your friends or colleagues through WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <form
          className={cn('flex flex-col gap-4')}
          onSubmit={(e) => {
            e.preventDefault()

            window.open(waLink, '_blank')
          }}
        >
          <div className='py-4 flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='whatsapp'>Whatsapp</Label>
              <Input
                id='whatsapp'
                placeholder='+6281212309812'
                required={true}
                type='tel'
                pattern='^\+[0-9]{1,15}$'
                name='whatsapp'
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9+]/g, '')

                  dispatch({
                    type: 'CHANGE_WHATSAPP',
                    payload: value,
                  })
                }}
                value={whatsapp}
              />
            </div>

            <div className='flex gap-2 items-center w-full'>
              <div className='flex flex-col gap-2 w-full'>
                <Label htmlFor='first-name'>First Name</Label>
                <Input
                  id='first-name'
                  placeholder='Vin'
                  required={true}
                  type='text'
                  name='first-name'
                  value={firstName}
                  onChange={(e) => {
                    dispatch({
                      type: 'CHANGE_FIRST_NAME',
                      payload: e.target.value,
                    })
                  }}
                />
              </div>

              <div className='flex flex-col gap-2 w-full'>
                <Label htmlFor='last-name'>Last Name</Label>
                <Input
                  id='last-name'
                  placeholder='Diesel'
                  required={true}
                  type='text'
                  name='last-name'
                  value={lastName}
                  onChange={(e) => {
                    dispatch({
                      type: 'CHANGE_LAST_NAME',
                      payload: e.target.value,
                    })
                  }}
                />
              </div>
            </div>
          </div>

          <div className='flex w-full items-center justify-end'>
            <Button type='submit'>Send message</Button>
          </div>
        </form>

        <DialogFooter>
          <Alert>
            <AlertTriangle className='h-4 w-4 mr-2' />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>WhatsApp number should follow the pattern:</AlertDescription>
            <AlertDescription>+[country code][phone number]</AlertDescription>
          </Alert>
        </DialogFooter>
      </DialogContent>
    </DropdownMenuDialogItem>
  )
}

export default WhatsappDialog
