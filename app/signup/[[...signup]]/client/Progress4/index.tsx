'use client'

import LoadingSpinner from '@/components/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { useState } from 'react'
import OtpInput from 'react-otp-input'

interface IProgress4 {
  email: string
  // eslint-disable-next-line no-unused-vars
  handleClerkSubmit: (_code: string) => void
}

export default function Progress4({ email, handleClerkSubmit }: IProgress4) {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <motion.section
      className='max-w-[400px] flex flex-col gap-6 mx-auto sm:px-0 px-4 pb-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className='flex flex-col space-y-2 text-center'>
        <h2 className='text-2xl font-semibold tracking-tight'>Please verify your email</h2>
        <p className='text-sm text-muted-foreground'>
          We&apos;ve sent a one-time code to <strong>{email}</strong>
        </p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          setLoading(true)

          try {
            const formData = new FormData(e.currentTarget)

            const otpArr: string[] = []

            for (let i = 0; i < 6; i++) {
              const otpNum = formData.get(`otp-${i}`)

              if (otpNum !== null) {
                otpArr.push(otpNum.toString())
              }
            }

            const otp = otpArr.join('')

            handleClerkSubmit(otp)
          } catch (error) {
            console.error(error)
            setLoading(false)
          }
        }}
        className='flex flex-col gap-4'
      >
        <OtpInput
          placeholder='696969'
          value={otp}
          onChange={setOtp}
          numInputs={6}
          containerStyle={'w-full flex flex-row justify-between gap-1 mt-2 font-medium text-xl'}
          inputStyle={{
            width: '100%',
            maxWidth: '60px',
          }}
          renderInput={(props, index) => <Input {...props} className='text-xl' name={`otp-${index}`} required={true} />}
        />
        <Button disabled={loading} type='submit'>
          {loading && <LoadingSpinner size={4} />}
          Verify code
        </Button>
      </form>
    </motion.section>
  )
}
