'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import cn from '@/utils/cn'
import {
  Boxes,
  ChevronRight,
  Cloud,
  CreditCard,
  Download,
  FileHeart,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  MoreHorizontal,
  Settings,
  Slack,
  UserPlus,
  Video,
  User,
  LogOut,
} from 'lucide-react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import { Separator } from '@/components/ui/separator'
import EmailDialog from '../../DesktopNavbar/MenuDropdown/EmailDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import WhatsappDialog from '../../DesktopNavbar/MenuDropdown/WhatsappDialog'
import Alert from '../../DesktopNavbar/MenuDropdown/Alert'
import { hoursBeforeOpen, isOutsideWorkingHours } from '@/helper'
import toast from 'react-hot-toast'
import { useClerk, useUser } from '@clerk/nextjs'
import { Skeleton } from '@/components/ui/skeleton'
import ReportAnIssue from '../../DesktopNavbar/MenuDropdown/ReportAnIssue'
import { loadTidio, onTidioChatApiReady } from '../../script'
import ErrorToast from '@/components/ErrorToast'
import { useState } from 'react'
import ErrorSafariContentBlocker from '@/lib/ErrorSafariContentBlocker'

const MobileSheet = ({ router, token }: { router: AppRouterInstance; token: string }) => {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [chatIsLoaded, setChatIsLoaded] = useState(false)

  if (!isLoaded || !isSignedIn) {
    return <Skeleton className='w-10 h-10 rounded-md' />
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' className={cn('px-2 py-1')}>
          <MoreHorizontal className='w-6 h-6' />
        </Button>
      </SheetTrigger>
      <SheetContent position='right' size='sm' className={cn('w-fit max-w-[320px]')}>
        <section className='flex flex-col items-start mt-3'>
          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/saved')}
              className={cn('w-full flex items-center justify-start')}
            >
              <FileHeart className='mr-2 h-4 w-4' />
              <span>Saved notes</span>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/settings')}
              className={cn('w-full flex items-center justify-start')}
            >
              <Settings className='mr-2 h-4 w-4' />
              <span>Settings</span>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/integrations')}
              className={cn('w-full flex items-center justify-start')}
            >
              <Boxes className='mr-2 h-4 w-4' />
              <span>Integrations</span>
            </Button>
          </SheetClose>

          <Separator className='my-4' />

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/download')}
              className={cn('w-full flex items-center justify-start')}
            >
              <Download className='mr-2 h-4 w-4' />
              <span>Download app</span>
            </Button>
          </SheetClose>

          <a
            className='w-full h-full'
            tabIndex={-1}
            target='_blank'
            href='https://join.slack.com/t/audeance/shared_invite/zt-1vn35z04j-OU8FpGdh45LrxgM3r0jESA'
            rel='noreferrer'
          >
            <Button variant='ghost' className={cn('w-full flex items-center justify-start')}>
              <Slack className='mr-2 h-4 w-4' />
              <span>Slack</span>
            </Button>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn('w-full h-fit')}>
              <Button variant='ghost' className={cn('w-full flex items-center justify-start')}>
                <UserPlus className='mr-2 h-4 w-4' />
                <span>Invite users</span>
                <ChevronRight className='ml-6 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <EmailDialog token={token} />
              <WhatsappDialog token={token} />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className={cn('w-full h-fit')}>
              <Button variant='ghost' className={cn('w-full flex items-center justify-start')}>
                <LifeBuoy className='mr-2 h-4 w-4' />
                <span>Support</span>
                <ChevronRight className='ml-6 h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <SheetClose asChild>
                <DropdownMenuItem onClick={() => router.push('/app/how-audea-works')}>
                  <Video className='mr-2 h-4 w-4' />
                  <span>How to use Audea</span>
                </DropdownMenuItem>
              </SheetClose>
              <DropdownMenuItem>
                <a
                  className='w-full h-full flex items-center'
                  target='_blank'
                  href='https://audeaid.notion.site/Help-Center-de94a1a7e3374417881e921f350d4ea4?pvs=4'
                  rel='noreferrer'
                >
                  <HelpCircle className='mr-2 h-4 w-4' />
                  <span>Help center</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const isOutsideWorkingHr = isOutsideWorkingHours()

                  if (isOutsideWorkingHr) {
                    const hrBeforeOpen = hoursBeforeOpen()

                    const isUsingMinute = hrBeforeOpen <= 1

                    toast(
                      (t) => (
                        <div className='flex items-center'>
                          <div>
                            <p>Chat is only available on 9:00 A.M to 5:00 P.M GMT+7!</p>
                            <p className={cn('text-xs font-light')}>
                              It will be available in{' '}
                              {isUsingMinute ? (hrBeforeOpen * 60).toFixed(1) : hrBeforeOpen.toFixed(1)}{' '}
                              {isUsingMinute ? 'minutes' : 'hours'}
                            </p>
                          </div>

                          <Button onClick={() => toast.dismiss(t.id)}>Dismiss</Button>
                        </div>
                      ),
                      { duration: Infinity },
                    )
                  } else {
                    if (chatIsLoaded) {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      window.tidioChatApi.show()
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      window.tidioChatApi.open()
                    } else {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      //@ts-ignore
                      document.tidioIdentify = {
                        distinct_id: user.id, // Unique visitor ID in your system
                        email: user.primaryEmailAddress?.emailAddress, // visitor email
                        name: `${user.firstName} ${user.lastName}`, // Visitor name
                        phone: user.phoneNumbers ? user.phoneNumbers[0] : '', //Visitor phone
                      }

                      toast
                        .promise(loadTidio(), {
                          loading: 'Loading chat...',
                          success: 'Chat is loaded!',
                          error: 'Error loading chat!',
                        })
                        .then(() => {
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          //@ts-ignore
                          if (window.tidioChatApi) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            window.tidioChatApi.on('ready', onTidioChatApiReady)
                          } else {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            document.addEventListener('tidioChat-ready', onTidioChatApiReady)
                          }

                          setChatIsLoaded(true)
                        })
                        .catch((e) => {
                          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

                          setChatIsLoaded(false)
                          ErrorToast({ action: 'loading support chat', error: e })

                          ErrorSafariContentBlocker(isSafari)
                        })
                    }
                  }
                }}
              >
                <MessageCircle className='mr-2 h-4 w-4' />
                <Alert />
                <span>Chat with us</span>
              </DropdownMenuItem>
              <ReportAnIssue token={token} />
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant='ghost' disabled className={cn('w-full flex items-center justify-start')}>
            <Cloud className='mr-2 h-4 w-4' />
            <span>API</span>
          </Button>

          <Separator className='my-4' />

          <div className='flex flex-col gap-0 px-4 py-2 select-none w-full h-fit'>
            <p className='font-light text-xs'>You are logged in as:</p>
            <p className='font-medium text-xs'>{user.primaryEmailAddress?.emailAddress}</p>
          </div>

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/subscriptions')}
              className={cn('w-full flex items-center justify-start')}
            >
              <CreditCard className='mr-2 h-4 w-4' />
              <span>Manage subscription</span>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={() => router.push('/app/accounts')}
              className={cn('w-full flex items-center justify-start')}
            >
              <User className='mr-2 h-4 w-4' />
              <span>Edit account</span>
            </Button>
          </SheetClose>

          <SheetClose asChild>
            <Button
              variant='ghost'
              onClick={async () => {
                await signOut()
                router.push('/login')
              }}
              className={cn('w-full flex items-center justify-start')}
            >
              <LogOut className='mr-2 h-4 w-4' />
              <span>Log out</span>
            </Button>
          </SheetClose>
        </section>
      </SheetContent>
    </Sheet>
  )
}

export default MobileSheet
