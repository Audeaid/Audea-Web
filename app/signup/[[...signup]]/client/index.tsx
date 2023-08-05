'use client'

import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import cn from '@/utils/cn'
import AudeaImage from '@/public/logo/secondary.svg'
import AudeaImageTwo from '@/public/logo/logo_text_black.svg'
import Toast from '@/lib/Toast'
import { useContext, useState } from 'react'
import { DarkModeContext } from '@/context/DarkMode'
import { useSignUp } from '@clerk/nextjs'
import Progress1 from './Progress1'
import Progress2 from './Progress2'
import Progress3 from './Progress3'
import Progress4 from './Progress4'
import Progress5 from './Progress5'
import toast from 'react-hot-toast'

interface IClient {
  initialEmail: string | null
  initialFirstName: string | null
  initialLastName: string | null
  referralJwt: string | null
}

export default function Client({ initialEmail, initialFirstName, initialLastName, referralJwt }: IClient) {
  const router = useRouter()
  const darkMode = useContext(DarkModeContext)

  const [progress, setProgress] = useState(1)

  const { isLoaded, signUp, setActive } = useSignUp()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [clerkId, setClerkId] = useState('')

  return (
    <div className='container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 px-0 select-none'>
      <Image
        src={darkMode ? AudeaImage : AudeaImageTwo}
        quality={100}
        draggable={false}
        alt='Audea Logo'
        height={25}
        className='lg:hidden block absolute left-4 top-5 md:left-8 md:top-9'
      />
      <Link
        href='/login'
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex'>
        <div
          className='absolute inset-0 bg-cover'
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)',
          }}
        />
        <div className='relative z-20 flex items-center text-lg font-medium'>
          <Image src={AudeaImage} quality={100} draggable={false} alt='Audea Logo' height={30} />
        </div>
        <div className='relative z-20 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              &ldquo;Audea has helped me countless of hours and helped me deliver idea faster so that I can bring my
              projects into fruition! Highly recommended!&rdquo;
            </p>
            <footer className='text-sm'>Annissaa Maharani</footer>
          </blockquote>
        </div>
      </div>
      <div className='lg:p-8 block'>
        {(() => {
          switch (progress) {
            case 1:
              return (
                <Progress1
                  setEmail={setEmail}
                  setProgress={setProgress}
                  initialValue={initialEmail}
                  referralJwt={referralJwt}
                />
              )

            case 2:
              return <Progress2 setPasswordForm={setPassword} setProgress={setProgress} />

            case 3:
              return (
                <Progress3
                  setFirstName={setFirstName}
                  setLastName={setLastName}
                  handleClerkSubmit={async (firstName, lastName) => {
                    try {
                      if (!isLoaded) {
                        return
                      }

                      await signUp.create({
                        emailAddress: email,
                        password,
                        firstName,
                        lastName,
                      })

                      // send the email.
                      toast
                        .promise(
                          signUp.prepareEmailAddressVerification({
                            strategy: 'email_code',
                          }),
                          {
                            loading: 'Sending OTP...',
                            success: 'Success sending OTP!',
                            error: 'Error sending OTP!',
                          },
                        )
                        .then(() => {
                          setProgress(4)
                        })
                    } catch (error) {
                      console.error(error)
                      console.log(JSON.stringify(error))
                    }
                  }}
                  initialFirstName={initialFirstName}
                  initialLastName={initialLastName}
                />
              )

            case 4:
              return (
                <Progress4
                  email={email}
                  handleClerkSubmit={async (otpCode) => {
                    if (!isLoaded) {
                      return
                    }

                    try {
                      toast.loading('OTP Verification...', { duration: 2000 })
                      const completeSignUp = await signUp.attemptEmailAddressVerification({
                        code: otpCode,
                      })
                      if (completeSignUp.status !== 'complete') {
                        /*  investigate the response, to see if there was an error
               or if the user needs to complete more steps.*/
                        console.log(JSON.stringify(completeSignUp, null, 2))
                      }
                      if (completeSignUp.status === 'complete') {
                        toast.success('Success verifying your OTP!')
                        if (!signUp.createdUserId) throw new Error('clerkId is undefined')

                        setClerkId(signUp.createdUserId)

                        setProgress(5)
                      }
                    } catch (err) {
                      toast.error('Error verifying your OTP!')
                      console.error(JSON.stringify(err, null, 2))
                    }
                  }}
                />
              )

            case 5:
              return (
                <Progress5
                  email={email}
                  clerkId={clerkId}
                  firstName={firstName}
                  lastName={lastName}
                  router={router}
                  handleClerk={async () => {
                    if (!isLoaded) {
                      return
                    }

                    await setActive({ session: signUp.createdSessionId })
                  }}
                  referralJwt={referralJwt}
                />
              )

            default:
              return <></>
          }
        })()}
      </div>

      <Toast />
    </div>
  )
}
