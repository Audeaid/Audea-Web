'use client'

import AddLottieAnimation from '@/components/AddLottieAnimation'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ISeeAllNotionDatabase,
  connectNotion,
  deleteNotionConnection,
  seeAllNotionDatabase,
  setNotionPrimaryDatabase,
} from './script'
import ErrorToast from '@/components/ErrorToast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { StickyNote, ArrowUpRightFromCircle } from 'lucide-react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import cn from '@/utils/cn'
import toast from 'react-hot-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Notion({ code, token }: { code: string; token: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<boolean | null>(null)

  const [workspaceName, setWorkspaceName] = useState('')
  const [workspacePicUrl, setWorkspacePicUrl] = useState<string | null>(null)

  const [notionDatabase, setNotionDatabase] = useState<ISeeAllNotionDatabase[] | null>(null)
  const [loadingNotionDb, setLoadingNotionDb] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)

        const response = await connectNotion(token, code)
        setWorkspaceName(response.workspaceName)
        setWorkspacePicUrl(response.workspaceIcon)

        setLoading(false)
        setSuccess(true)
      } catch (error) {
        console.error(error)

        setLoading(false)
        setSuccess(false)

        ErrorToast('connecting notion', error)

        setTimeout(() => {
          router.push('/app/integrations')
        }, 5000)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        if (success) {
          setLoadingNotionDb(true)
          const response = await seeAllNotionDatabase(token)
          setNotionDatabase(response)
          setLoadingNotionDb(false)
        }
      } catch (error) {
        setLoadingNotionDb(false)
        console.error(error)
        ErrorToast('see all notion database', error)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  return (
    <motion.section
      className='max-w-[400px] flex flex-col gap-8 mx-auto sm:px-0 px-4 pb-10 items-center justify-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {(() => {
        if (loading) {
          return (
            <>
              <div className='w-fit h-fit max-w-[300px] max-h-[200px]'>
                <AddLottieAnimation path='/lottie/9844-loading-40-paperplane.json' loop={true} />
              </div>
              <h3 className='text-xl text-center font-medium'>Connecting your Notion...</h3>
            </>
          )
        } else {
          if (success === true) {
            return (
              <Card>
                <CardHeader>
                  <CardTitle>Select your database</CardTitle>
                  <CardDescription>
                    Please select one database for Audea to put its note in your Notion.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <section className='flex flex-col gap-2 mb-8'>
                    <p>Workspace:</p>
                    <section className='flex items-center gap-2'>
                      <Avatar>
                        <AvatarImage src={workspacePicUrl ?? undefined} />
                        <AvatarFallback>{workspaceName[0]}</AvatarFallback>
                      </Avatar>
                      <p>{workspaceName}</p>
                    </section>
                  </section>

                  {(() => {
                    if (notionDatabase) {
                      if (loadingNotionDb) {
                        return <LoadingSpinner size={4} />
                      } else {
                        return (
                          <form
                            className='space-y-8'
                            onSubmit={(e) => {
                              e.preventDefault()

                              const formData = new FormData(e.currentTarget)
                              const databaseForm = formData.get('database')
                              const automaticForm = formData.get('automatic')

                              if (!databaseForm) return

                              const automatic = (() => {
                                if (automaticForm) {
                                  if (automaticForm.toString() === 'on') {
                                    return true
                                  } else {
                                    return false
                                  }
                                } else {
                                  return false
                                }
                              })()

                              toast
                                .promise(setNotionPrimaryDatabase(token, databaseForm.toString(), automatic), {
                                  loading: 'Saving your notion settings...',
                                  success: 'Your Notion settings saved!',
                                  error: 'Error saving your Notion settings!',
                                })
                                .then(() => {
                                  router.push('/app/integrations')
                                })
                                .catch((e) => {
                                  ErrorToast('saving your notion settings', e)
                                })
                            }}
                          >
                            <RadioGroup required={true} name='database' className={cn('space-y-2')}>
                              {notionDatabase.map((v, i) => {
                                return (
                                  <div className='flex items-center space-x-2' key={i}>
                                    <RadioGroupItem value={v.id} id={`r${i}`} />

                                    <Label htmlFor={`r${i}`} className='space-x-2 flex items-center'>
                                      {v.icon ? (
                                        <Image src={v.icon} alt={''} width={20} height={20} draggable={false} />
                                      ) : (
                                        <StickyNote className='w-4 h-4' />
                                      )}
                                      <span>{v.title}</span>
                                    </Label>
                                    {v.url && (
                                      <a href={v.url}>
                                        <ArrowUpRightFromCircle className='w-3 h-3' />
                                      </a>
                                    )}
                                  </div>
                                )
                              })}
                            </RadioGroup>
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='automatic' name='automatic' />
                              <label
                                htmlFor='automatic'
                                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                              >
                                Automatically post new note to Notion
                              </label>
                            </div>

                            <Button type='submit' className={cn('w-full')}>
                              Save settings
                            </Button>
                          </form>
                        )
                      }
                    } else {
                      if (loadingNotionDb) {
                        return <LoadingSpinner size={4} />
                      } else {
                        return (
                          <section className='space-y-4'>
                            <p>
                              Didn&apos;t see your database here? Make sure that you allowed Audea to post to your
                              Notion database (not your Notion page).
                            </p>

                            <p>Please delete your Notion connection and try again.</p>

                            <Button
                              variant='destructive'
                              className={cn('w-full')}
                              type='button'
                              onClick={() => {
                                toast
                                  .promise(deleteNotionConnection(token), {
                                    loading: 'Deleting your notion connection...',
                                    success: 'Notion account deleted!',
                                    error: 'Error deleting your notion connection!',
                                  })
                                  .then(() => {
                                    router.push('/app/integrations')
                                  })
                                  .catch((e) => {
                                    ErrorToast('deleting your notion connection', e)
                                  })
                              }}
                            >
                              Delete your Notion connection
                            </Button>
                          </section>
                        )
                      }
                    }
                  })()}
                </CardContent>
              </Card>
            )
          } else if (success === false) {
            return (
              <>
                <div className='w-fit h-fit max-w-[200px] max-h-[200px]'>
                  <AddLottieAnimation path='/lottie/91878-bouncy-fail.json' loop={false} />
                </div>
                <h3 className='text-xl text-center font-medium'>Error connecting your Notion! Please try again!</h3>
              </>
            )
          } else {
            return <></>
          }
        }
      })()}
    </motion.section>
  )
}
