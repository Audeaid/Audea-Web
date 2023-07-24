'use client'

import cn from '@/utils/cn'
import { CardContent } from '@/components/ui/card'
import type { SignInFirstFactor } from '@clerk/types'
import { Badge } from '@/components/ui/badge'
import { Edit, FileLock2, Key } from 'lucide-react'
import { MouseEventHandler } from 'react'
import { Button } from '@/components/ui/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

interface Props {
  email: string
  firstFactors: SignInFirstFactor[]
  handleEditEmail: MouseEventHandler<HTMLButtonElement>
  handleEmailCode: MouseEventHandler<HTMLButtonElement>
  handlePassword: MouseEventHandler<HTMLButtonElement>
  handleGoogle: MouseEventHandler<HTMLButtonElement>
}

export default function ChooseFirstFactor({
  email,
  firstFactors,
  handleEditEmail,
  handleEmailCode,
  handlePassword,
  handleGoogle,
}: Props) {
  return (
    <CardContent className={cn('flex flex-col gap-8 mt-4')}>
      <Badge variant='outline' className={cn('text-sm px-4 py-1.5 w-fit h-fit')}>
        {email}
        <button onClick={handleEditEmail} type='button'>
          <Edit className='ml-4 w-4 h-4' />
        </button>
      </Badge>

      <div className='flex flex-col gap-4 mt-10'>
        {firstFactors.map(({ strategy }, index) => {
          if (strategy === 'email_code') {
            return (
              <Button className={cn('min-w-full h-fit')} key={index} onClick={handleEmailCode}>
                <Key className='mr-2 w-4 h-4' />
                Sign in with a one-time email code
              </Button>
            )
          } else if (strategy === 'password') {
            return (
              <Button className={cn('min-w-full h-fit')} key={index} onClick={handlePassword}>
                <FileLock2 className='mr-2 w-4 h-4' />
                Sign in with your password
              </Button>
            )
          } else if (strategy === 'oauth_google') {
            return (
              <Button className={cn('min-w-full h-fit')} key={index} onClick={handleGoogle}>
                <FontAwesomeIcon icon={faGoogle} className='mr-2 w-4 h-4' />
                Sign in with Google
              </Button>
            )
          } else {
            return <></>
          }
        })}
      </div>

      <p className='select-none text-background' aria-hidden={true}>
        By clicking &quot;Continue with Google / Email&quot; above, you
      </p>
    </CardContent>
  )
}
