'use client'

import cn from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { FormEventHandler } from 'react'
import { CardContent, CardFooter } from '@/components/ui/card'
import SocialMediaLogin from '@/components/SocialMediaLogin'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/LoadingSpinner'
import { PRIVACY_POLICY_URL, TERMS_URL } from '@/utils/constant'

interface Props {
  onSubmit: FormEventHandler<HTMLFormElement>
  loading: boolean
  errorMsg: string | null
}

export default function FirstSequence({ onSubmit, loading, errorMsg }: Props) {
  return (
    <>
      <CardContent className={cn('flex flex-col gap-8 my-10')}>
        <SocialMediaLogin type='google' disabled={false} signInOrSignUp='signIn'>
          Continue with Google
        </SocialMediaLogin>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Or</span>
          </div>
        </div>

        <form className='flex flex-col gap-3' onSubmit={onSubmit}>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input placeholder='Enter your email address...' type='email' name='email' required={true} id='email' />
          </div>

          <Button disabled={loading} type='submit'>
            {loading && <LoadingSpinner size={4} />}
            Continue with email
          </Button>

          {errorMsg && <p className='text-xs text-justify text-destructive'>{errorMsg}</p>}
        </form>
      </CardContent>
      <CardFooter>
        <p className='text-xs text-justify select-none'>
          By clicking &quot;Continue with Google / Email&quot; above, you acknowledge that you have read and understood,
          and agree to Audea&apos;s{' '}
          <a href={TERMS_URL} className='hover:text-blue-500' target='_blank' rel='noreferrer'>
            Terms of Service
          </a>{' '}
          and{' '}
          <a href={PRIVACY_POLICY_URL} className='hover:text-blue-500' target='_blank' rel='noreferrer'>
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </>
  )
}
