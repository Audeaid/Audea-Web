'use client'

import { motion } from 'framer-motion'
import { Dispatch, SetStateAction, useState } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import SocialMediaLogin from '@/components/SocialMediaLogin'
import { getDeletedUser } from './script'
import axios from 'axios'
import { User } from '@clerk/nextjs/dist/types/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface IProgress1 {
  setEmail: Dispatch<SetStateAction<string>>
  setProgress: Dispatch<SetStateAction<number>>
  initialValue: string | null
  referralJwt: string | null
}

const Progress1 = ({ setEmail, setProgress, initialValue, referralJwt }: IProgress1) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(initialValue ?? '')

  return (
    <motion.section
      className='max-w-[400px] flex flex-col sm:gap-12 gap-6 mx-auto sm:px-0 px-4 pb-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Create an account</h1>
        <p className='text-sm text-muted-foreground'>Enter your email below to create your account</p>
      </div>
      <section className='flex flex-col gap-8'>
        <form
          className='flex flex-col gap-3'
          onSubmit={async (e) => {
            e.preventDefault()

            setLoading(true)

            const formData = new FormData(e.currentTarget)
            const emailForm = formData.get('email')

            try {
              if (emailForm !== null) {
                const { data: isEmailExistResponse }: { data: User[] } = await axios.post('/api/clerkUser', formData)

                const isAccountDeletedResponse = await getDeletedUser({
                  email: emailForm.toString(),
                })

                const isEmailExist = isEmailExistResponse.length !== 0
                const isAccountDeleted = isAccountDeletedResponse !== null

                if (isEmailExist) {
                  setErrorMsg('Email is already registered, please login!')
                  setLoading(false)
                } else if (isAccountDeleted) {
                  setErrorMsg('Email is already been associated to a deleted account!')
                  setLoading(false)
                } else {
                  // Email does not exist
                  setEmail(emailForm.toString())

                  setLoading(false)

                  setProgress(2)
                }
              }
            } catch (error) {
              setErrorMsg("We could not reach Audea's server. Please try again in a few minutes.")

              setLoading(false)

              console.error(error)
            }
          }}
        >
          <div>
            <Label htmlFor='email'>Email</Label>
            <Input
              placeholder='Enter your email address...'
              type='email'
              name='email'
              required={true}
              id='email'
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
              }}
            />
          </div>

          <Button disabled={loading} type='submit'>
            {loading && <LoadingSpinner size={4} />}
            Continue with email
          </Button>
        </form>

        {errorMsg && <p className='text-xs text-justify text-destructive'>{errorMsg}</p>}

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <span className='w-full border-t' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>Or</span>
          </div>
        </div>

        <section className='flex flex-col gap-3'>
          <SocialMediaLogin type='google' disabled={false} referralId={referralJwt} signInOrSignUp='signUp'>
            Continue with Google
          </SocialMediaLogin>
        </section>

        <p className='text-xs text-justify select-none'>
          By clicking &quot;Continue with Google / Email&quot; above, you acknowledge that you have read and understood,
          and agree to Audea&apos;s{' '}
          <a
            href='https://durrrian.notion.site/Terms-of-Service-d0dcba2ccba54a9bb60b6c1dc0255c4f?pvs=4'
            className='hover:text-blue-500'
            target='_blank'
            rel='noreferrer'
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a
            href='https://durrrian.notion.site/Privacy-Policy-f865747ed0e142fa92680408d91fe136?pvs=4'
            className='hover:text-blue-500'
            target='_blank'
            rel='noreferrer'
          >
            Privacy Policy
          </a>
          .
        </p>
      </section>
    </motion.section>
  )
}

export default Progress1
