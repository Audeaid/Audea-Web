'use client'

import cn from '@/utils/cn'
import { CardContent } from '@/components/ui/card'
import { FormEventHandler, useState } from 'react'
import { Button } from '@/components/ui/button'
import OtpInput from 'react-otp-input'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Reducer, useReducer } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'

interface PasswordState {
  password: string
  hasSymbol: boolean
  hasNumber: boolean
  hasUppercase: boolean
}

type PasswordAction = { type: 'UPDATE_PASSWORD'; payload: string }

interface Props {
  email: string
  handleSubmit: FormEventHandler<HTMLFormElement>
  loading: boolean
  errorMsg: string | null
}

export default function ForgotPassword({ email, handleSubmit, loading, errorMsg }: Props) {
  const [otp, setOtp] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [passwordState, passwordDispatch] = useReducer<Reducer<PasswordState, PasswordAction>>(
    (state, action) => {
      switch (action.type) {
        case 'UPDATE_PASSWORD':
          return {
            password: action.payload,
            hasSymbol: /[!@#$%^&*]/.test(action.payload),
            hasNumber: /\d/.test(action.payload),
            hasUppercase: /[A-Z]/.test(action.payload),
          }
        default:
          return state
      }
    },
    {
      password: '',
      hasSymbol: false,
      hasNumber: false,
      hasUppercase: false,
    },
  )

  const passwordRequirement = [
    { text: 'Minimum 1 symbol', bool: passwordState.hasSymbol },
    { text: 'Minimum 1 number', bool: passwordState.hasNumber },
    { text: 'Minimum 1 uppercase letter', bool: passwordState.hasUppercase },
  ]

  return (
    <CardContent className={cn('flex flex-col gap-8 mt-4')}>
      <Badge variant='outline' className={cn('text-sm px-4 py-1.5 w-fit h-fit')}>
        {email}
      </Badge>

      <p>
        Create your new strong password and a one-time code to <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
        <section className='flex flex-col gap-4'>
          <section className='flex flex-col gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              placeholder='New password'
              id='password'
              type={showPassword ? 'text' : 'password'}
              name='password'
              required={true}
              pattern='^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$'
              minLength={8}
              maxLength={64}
              onChange={(e) => {
                const password = e.target.value
                setPassword(password)
                passwordDispatch({
                  type: 'UPDATE_PASSWORD',
                  payload: password,
                })
              }}
            />

            <button
              type='button'
              className='text-xs font-medium flex gap-1 items-center text-purple-400 w-fit h-fit'
              onClick={() => {
                setShowPassword(!showPassword)
              }}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              {showPassword ? 'Hide password' : 'Show password'}
            </button>
          </section>

          <section className='flex flex-col gap-1'>
            <p className='text-sm'>Password must have:</p>
            <ul className='flex flex-col gap-0 text-sm'>
              {passwordRequirement.map(({ text, bool }, index) => {
                return (
                  <li key={index} className='flex gap-1 items-center justify-start text-xs'>
                    <div className='w-fit h-fit'>
                      <FontAwesomeIcon
                        icon={bool ? faCheck : faXmark}
                        className={`${bool ? 'text-green-500' : 'text-red-500'}`}
                      />
                    </div>
                    <p>{text}</p>
                  </li>
                )
              })}
            </ul>
          </section>
        </section>

        <section className='flex flex-col gap-2'>
          <Label htmlFor='confirmPassword'>Confirm Password</Label>
          <Input
            placeholder='Confirm your password'
            id='confirmPassword'
            type={showConfirmPassword ? 'text' : 'password'}
            name='confirmPassword'
            required={true}
            pattern='^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$'
            minLength={8}
            maxLength={64}
            onChange={(e) => {
              const password = e.target.value
              setConfirmPassword(password)
            }}
          />

          <button
            type='button'
            className='text-xs font-medium flex gap-1 items-center text-purple-400 w-fit h-fit'
            onClick={() => {
              setShowConfirmPassword(!showConfirmPassword)
            }}
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            {showConfirmPassword ? 'Hide password' : 'Show password'}
          </button>
        </section>

        <section className='flex flex-col gap-2'>
          <Label htmlFor='otp-1'>One-time code</Label>
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
            renderInput={(props, index) => (
              <Input {...props} className='text-xl' name={`otp-${index}`} required={true} />
            )}
          />
        </section>

        <Button disabled={password !== confirmPassword || loading} type='submit'>
          {loading && <LoadingSpinner size={4} />}
          Verify code
        </Button>

        {errorMsg && <p className='text-xs text-justify text-destructive'>{errorMsg}</p>}
      </form>

      <p className='select-none text-background' aria-hidden={true}>
        By clicking &quot;Continue with Google / Email&quot; above, you
      </p>
    </CardContent>
  )
}
