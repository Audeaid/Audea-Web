'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import cn from '@/utils/cn'
import { useState, Dispatch, SetStateAction } from 'react'
import toast from 'react-hot-toast'
import ErrorToast from '@/components/ErrorToast'
import { useUser } from '@clerk/nextjs'
import { Globe, Terminal } from 'lucide-react'
import { addUsername, createSharedContent, getUsername, searchUserByUsername } from './script'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { deleteSharedContent } from './script/deleteSharedContent'
import { IGetSharedContentByContentId } from '../../../graphql'

export default function ShareToPublic({
  token,
  sharedContent,
  contentId,
  open,
  setOpen,
}: {
  token: string
  sharedContent: IGetSharedContentByContentId | null
  contentId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [loading, setLoading] = useState(false)
  const [currentAction, setCurrentAction] = useState(sharedContent === null ? 'initial' : 'published')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const [username, setUsername] = useState(sharedContent === null ? '' : sharedContent.username)

  const [generatedId, setGeneratedId] = useState(
    sharedContent === null ? generateFiveRandomChar() : sharedContent.generatedId,
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { isLoaded, isSignedIn, user } = useUser()

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn('select-none')}>
        <DialogHeader>
          <DialogTitle>Publish to the public</DialogTitle>
          <DialogDescription>Share your note to the public!</DialogDescription>
        </DialogHeader>

        {(() => {
          if (currentAction === 'initial') {
            return (
              <section className='w-full h-fit flex flex-col items-center justify-center text-center gap-4 mt-4'>
                <section className='flex flex-col items-center justify-center gap-2'>
                  <Globe />
                  <p className='font-medium'>Publish to the public</p>
                </section>

                <p className='text-muted-foreground'>
                  Publish a static website of this note. You can allow others to view, and comment.
                </p>

                <Button
                  className={cn('w-full')}
                  onClick={async () => {
                    try {
                      setLoading(true)

                      const response = await getUsername({ token })

                      setFirstName(response.firstName)
                      setLastName(response.lastName)

                      if (response.username !== null) {
                        const response = await createSharedContent({
                          token,
                          contentId,
                        })
                        setUsername(response.username)
                        setGeneratedId(response.generatedId)
                        setCurrentAction('published')
                      } else {
                        setCurrentAction('create-username')
                      }

                      setLoading(false)
                    } catch (error) {
                      setLoading(false)
                      ErrorToast('getting your username', error)
                    }
                  }}
                >
                  {loading && <LoadingSpinner size={4} />} Publish your note
                </Button>
              </section>
            )
          } else if (currentAction === 'create-username') {
            return (
              <form
                className='w-full h-fit flex flex-col gap-8 mt-4'
                onSubmit={(e) => {
                  e.preventDefault()

                  const formData = new FormData(e.currentTarget)

                  const usernameForm = formData.get('username')

                  if (!usernameForm) return
                  ;(async () => {
                    try {
                      const searchUsername = await searchUserByUsername({
                        token,
                        username: usernameForm.toString(),
                      })

                      if (searchUsername !== null) {
                        setErrorMessage('Username has already been taken')
                      } else {
                        toast
                          .promise(
                            addUsername({
                              token,
                              username: usernameForm.toString(),
                              clerkUserId: user.id,
                            }),
                            {
                              loading: 'Creating your username...',
                              success: 'Username created!',
                              error: 'Error creating your username!',
                            },
                          )
                          .then(() => {
                            toast
                              .promise(createSharedContent({ token, contentId }), {
                                loading: 'Sharing your note...',
                                success: 'Note shared!',
                                error: 'Error sharing your note!',
                              })
                              .then((data) => {
                                setUsername(data.username)
                                setGeneratedId(data.generatedId)
                                setCurrentAction('published')
                              })
                              .catch((e) => {
                                ErrorToast('sharing your note', e)
                              })
                          })
                          .catch((e) => {
                            ErrorToast('creating your username', e)
                          })
                      }
                    } catch (error) {
                      ErrorToast('searching for the available username', error)
                    }
                  })()
                }}
              >
                <section className='space-y-2'>
                  <Label htmlFor='username' className={cn('text-base')}>
                    Please create a username
                  </Label>

                  <Input
                    placeholder={`${firstName.toLowerCase()}${lastName.toLowerCase()}`}
                    id='username'
                    name='username'
                    value={username}
                    onChange={(e) => {
                      const val = e.currentTarget.value

                      setUsername(val)

                      setErrorMessage(null)
                    }}
                    minLength={3}
                    maxLength={15}
                    pattern='^[a-zA-Z0-9]+$'
                    required
                  />
                </section>

                <Alert>
                  <Terminal className='h-4 w-4' />
                  <AlertTitle>Heads up!</AlertTitle>
                  <AlertDescription>
                    Your username should be an <strong>alpha-numeric (a-z, A-Z, 0-9) characters only</strong>. Your
                    username will be shown on your public note like this:{' '}
                    <code className='bg-muted px-2 py-1 rounded-md mt-1 block w-fit'>
                      https://audea.id/@
                      {username === '' ? `${firstName.toLowerCase()}${lastName.toLowerCase()}` : username}/{generatedId}
                    </code>
                  </AlertDescription>
                </Alert>

                {errorMessage && <p className='text-sm text-red-500'>{errorMessage}</p>}

                <Button type='submit' className={cn('w-full')}>
                  Create username
                </Button>
              </form>
            )
          } else if (currentAction === 'published') {
            return (
              <section className='space-y-8'>
                <p className='flex items-center gap-2 text-sky-500 font-medium'>
                  <span className='relative flex h-3 w-3'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75' />
                    <span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500' />
                  </span>
                  This page is live on the web
                </p>

                <section className='w-full h-fit flex items-center gap-0 flex-nowrap rounded-lg border-border border overflow-hidden text-sm'>
                  <p className='dark:bg-gray-600 bg-gray-300 p-2 w-full truncate'>
                    https://audea.id/@{username}/{generatedId}
                  </p>
                  <button
                    className='dark:bg-white bg-black text-white dark:text-black border-l border-border p-2 min-w-fit'
                    type='button'
                    onClick={() => {
                      const url = `https://audea.id/@${username}/${generatedId}`
                      toast.promise(navigator.clipboard.writeText(url), {
                        loading: 'Copying link...',
                        success: 'Link copied!',
                        error: 'Error copying link!',
                      })
                    }}
                  >
                    Copy web link
                  </button>
                </section>

                <section className='grid grid-cols-2 gap-4'>
                  <Button
                    variant='outline'
                    type='button'
                    className={cn('w-full')}
                    onClick={() => {
                      toast
                        .promise(deleteSharedContent({ token, contentId }), {
                          loading: 'Unpublish your note...',
                          success: 'Note unpublished!',
                          error: 'Error unpublish your note!',
                        })
                        .then(() => {
                          setCurrentAction('initial')
                        })
                        .catch((e) => {
                          ErrorToast('unpublish your note', e)
                        })
                    }}
                  >
                    Unpublish
                  </Button>

                  <a href={`https://audea.id/@${username}/${generatedId}`} target='_blank' className='w-full h-fit'>
                    <Button type='button' className={cn('w-full bg-sky-500')} tabIndex={-1}>
                      View site
                    </Button>
                  </a>
                </section>
              </section>
            )
          } else {
            return <></>
          }
        })()}
      </DialogContent>
    </Dialog>
  )
}

function generateFiveRandomChar(): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_~'
  let result = ''

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}
