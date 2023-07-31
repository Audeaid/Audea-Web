'use client'

import {
  Cloud,
  Boxes,
  Slack,
  LifeBuoy,
  LogOut,
  MessageCircle,
  Settings,
  FileHeart,
  UserPlus,
  HelpCircle,
  Video,
  CreditCard,
  Download,
  User,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context'
import EmailDialog from '../../lib/EmailDialog'
import WhatsappDialog from '../../lib/WhatsappDialog'
import { useUser } from '@clerk/nextjs'
import { useClerk } from '@clerk/clerk-react'
import ReportAnIssue from '../../lib/ReportAnIssue'
import toast from 'react-hot-toast'
import { hoursBeforeOpen, isOutsideWorkingHours } from '@/helper'
import cn from '@/utils/cn'
import { Skeleton } from '@/components/ui/skeleton'
import { loadTidio, onTidioChatApiReady } from '../../script'
import ErrorToast from '@/components/ErrorToast'
import { useState } from 'react'
import ErrorSafariContentBlocker from '@/lib/ErrorSafariContentBlocker'
import { HELP_URL, SLACK_AUDEANCE_INVITATION_URL } from '@/utils/constant'

interface Props {
  router: AppRouterInstance
  token: string
}

const MenuDropdown = ({ router, token }: Props) => {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const [chatIsLoaded, setChatIsLoaded] = useState(false)

  if (!isLoaded || !isSignedIn) {
    return <Skeleton className='w-16 h-10 rounded-md' />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className={cn('print:hidden')}>
          Menu
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel className='select-none'>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/app/saved')}>
            <FileHeart className='mr-2 h-4 w-4' />
            <span>Saved notes</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/app/settings')}>
            <Settings className='mr-2 h-4 w-4' />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/app/integrations')}>
            <Boxes className='mr-2 h-4 w-4' />
            <span>Integrations</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/app/download')}>
          <Download className='mr-2 h-4 w-4' />
          <span>Download app</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            className='w-full h-full flex items-center'
            target='_blank'
            href={SLACK_AUDEANCE_INVITATION_URL}
            rel='noreferrer'
          >
            <Slack className='mr-2 h-4 w-4' />
            <span>Slack</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className='mr-2 h-4 w-4' />
            <span>Invite users</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <EmailDialog token={token} />
              <WhatsappDialog token={token} />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LifeBuoy className='mr-2 h-4 w-4' />
            <span>Support</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => router.push('/app/how-audea-works')}>
                <Video className='mr-2 h-4 w-4' />
                <span>How to use Audea</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a className='w-full h-full flex items-center' target='_blank' href={HELP_URL} rel='noreferrer'>
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
                <span>Chat with us</span>
              </DropdownMenuItem>
              <ReportAnIssue token={token} />
              <DropdownMenuItem onClick={() => router.push('/app/talk-to-founders')}>
                <Users className='mr-2 h-4 w-4' />
                <span>Talk to the founders</span>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <Cloud className='mr-2 h-4 w-4' />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className='flex flex-col gap-0 px-2 py-1.5 select-none'>
          <p className='font-light text-xs'>You are logged in as:</p>
          <p className='font-medium text-xs'>{user.primaryEmailAddress?.emailAddress}</p>
        </div>
        <DropdownMenuItem onClick={() => router.push('/app/subscriptions')}>
          <CreditCard className='mr-2 h-4 w-4' />
          <span>Manage subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/app/accounts')}>
          <User className='mr-2 h-4 w-4' />
          <span>Edit account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut()
            router.push('/login')
          }}
        >
          <LogOut className='mr-2 h-4 w-4' />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MenuDropdown
