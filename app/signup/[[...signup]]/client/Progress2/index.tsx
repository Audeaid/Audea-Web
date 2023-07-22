'use client'

import { motion } from 'framer-motion'
import { Dispatch, Reducer, SetStateAction, useReducer, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faEye, faEyeSlash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface PasswordState {
  password: string
  hasSymbol: boolean
  hasNumber: boolean
  hasUppercase: boolean
}

type PasswordAction = { type: 'UPDATE_PASSWORD'; payload: string }

interface IProgress2 {
  setPasswordForm: Dispatch<SetStateAction<string>>
  setProgress: Dispatch<SetStateAction<number>>
}

const Progress2 = ({ setPasswordForm, setProgress }: IProgress2) => {
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
    <motion.section
      className='max-w-[400px] flex flex-col gap-6 mx-auto sm:px-0 px-4 pb-10'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Create strong password</h1>
        <p className='text-sm text-muted-foreground'>Next, please create a strong password for your Audea account.</p>
      </div>

      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const formData = new FormData(e.currentTarget)
          const passwordForm = formData.get('password')

          if (passwordForm !== null) {
            setPasswordForm(passwordForm.toString())
          }

          setProgress(3)
        }}
        className='flex flex-col gap-6'
      >
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
            <p className='min-w-fit h-fit'>{showConfirmPassword ? 'Hide password' : 'Show password'}</p>
          </button>
        </section>

        <Button type='submit' disabled={password !== confirmPassword}>
          Create your password
        </Button>
      </form>
    </motion.section>
  )
}

export default Progress2
