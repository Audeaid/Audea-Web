'use client'

import Image from 'next/image'
import cn from '@/utils/cn'
import { Button } from '@/components/ui/button'
import ErrorToast from '@/components/ErrorToast'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  setNotionPrimaryDatabase,
  deleteNotionConnection,
  ISeeAllNotionDatabase,
} from '@/app/app/integrations/[...connections]/lib/Notion/script'
import LoadingSpinner from '@/components/LoadingSpinner'
import toast from 'react-hot-toast'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { StickyNote, ArrowUpRightFromCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dispatch, SetStateAction } from 'react'
import { IGetNotionAccount } from '@/app/app/integrations/graphql'

interface Props {
  dialogOpen: boolean
  setDialogOpen: Dispatch<SetStateAction<boolean>>
  getNotionAccount: IGetNotionAccount
  notionDatabase: ISeeAllNotionDatabase[] | null
  loading: boolean
  token: string
  automaticChecked: boolean
  setAutomaticChecked: Dispatch<SetStateAction<boolean>>
}

export default function Manage({
  token,
  dialogOpen,
  setDialogOpen,
  getNotionAccount,
  notionDatabase,
  loading,
  automaticChecked,
  setAutomaticChecked,
}: Props) {
  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className={cn('select-none')}>
        <DialogHeader>
          <DialogTitle>Manage your Notion connection</DialogTitle>
          <DialogDescription>
            You can select your primary database in which Audea will post your note to.
          </DialogDescription>
        </DialogHeader>

        <section>
          <section className='flex flex-col gap-2 mb-8'>
            <p>Workspace:</p>
            <section className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src={getNotionAccount.workspaceIcon ?? undefined} />
                <AvatarFallback>{getNotionAccount.workspaceName[0]}</AvatarFallback>
              </Avatar>

              <p>{getNotionAccount.workspaceName}</p>
            </section>
          </section>

          {(() => {
            if (notionDatabase) {
              if (loading) {
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
                        .catch((error) => {
                          ErrorToast({ action: 'saving your notion settings', error })
                        })
                    }}
                  >
                    <ScrollArea className='h-[250px] w-full overflow-scroll'>
                      <RadioGroup
                        required={true}
                        name='database'
                        className={cn('space-y-2')}
                        defaultValue={getNotionAccount.primaryDatabase ?? undefined}
                      >
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
                    </ScrollArea>

                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='automatic'
                        name='automatic'
                        checked={automaticChecked}
                        onCheckedChange={(v) => {
                          if (v) {
                            setAutomaticChecked(true)
                          } else {
                            setAutomaticChecked(false)
                          }
                        }}
                      />
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
              if (loading) {
                return <LoadingSpinner size={4} />
              } else {
                return (
                  <section className='space-y-4'>
                    <p>
                      Didn&apos;t see your database here? Make sure that you allowed Audea to post to your Notion
                      database (not your Notion page).
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
                          .catch((error) => {
                            ErrorToast({ action: 'deleting your notion connection', error })
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
        </section>
      </DialogContent>
    </Dialog>
  )
}
