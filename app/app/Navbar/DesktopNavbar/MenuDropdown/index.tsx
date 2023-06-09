'use client';

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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dropdown-menu';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import EmailDialog from './EmailDialog';
import WhatsappDialog from './WhatsappDialog';
import { useUser } from '@clerk/nextjs';
import { useClerk } from '@clerk/clerk-react';
import ReportAnIssue from './ReportAnIssue';
import Alert from './Alert';
import toast from 'react-hot-toast';
import { hoursBeforeOpen, isOutsideWorkingHours } from '@/helper';
import cn from '@/utils/cn';
import { Skeleton } from '@/components/ui/skeleton';

const MenuDropdown = ({
  router,
  token,
}: {
  router: AppRouterInstance;
  token: string;
}) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();

  if (!isLoaded || !isSignedIn) {
    return <Skeleton className="w-16 h-10 rounded-md" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="select-none">
          Workspaces
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/app/saved')}>
            <FileHeart className="mr-2 h-4 w-4" />
            <span>Saved notes</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/app/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/app/integrations')}>
            <Boxes className="mr-2 h-4 w-4" />
            <span>Integrations</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/app/download')}>
          <Download className="mr-2 h-4 w-4" />
          <span>Download app</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a
            className="w-full h-full flex items-center"
            target="_blank"
            href="https://join.slack.com/t/audeance/shared_invite/zt-1vn35z04j-OU8FpGdh45LrxgM3r0jESA"
          >
            <Slack className="mr-2 h-4 w-4" />
            <span>Slack</span>
          </a>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlus className="mr-2 h-4 w-4" />
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
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => router.push('/app/how-audea-works')}
              >
                <Video className="mr-2 h-4 w-4" />
                <span>How Audea works</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a
                  className="w-full h-full flex items-center"
                  target="_blank"
                  href="https://audeaid.notion.site/Help-Center-de94a1a7e3374417881e921f350d4ea4?pvs=4"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help center</span>
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const isOutsideWorkingHr = isOutsideWorkingHours();

                  if (isOutsideWorkingHr) {
                    const hrBeforeOpen = hoursBeforeOpen();

                    const isUsingMinute = hrBeforeOpen <= 1;

                    toast(
                      (t) => (
                        <div className="flex items-center">
                          <div>
                            <p>
                              Chat is only available on 9:00 A.M to 5:00 P.M
                              GMT+7!
                            </p>
                            <p className={cn('text-xs font-light')}>
                              It will be available in{' '}
                              {isUsingMinute
                                ? (hrBeforeOpen * 60).toFixed(1)
                                : hrBeforeOpen.toFixed(1)}{' '}
                              {isUsingMinute ? 'minutes' : 'hours'}
                            </p>
                          </div>

                          <Button onClick={() => toast.dismiss(t.id)}>
                            Dismiss
                          </Button>
                        </div>
                      ),
                      { duration: Infinity }
                    );
                  } else {
                    //@ts-ignore
                    if (window.tidioChatApi) {
                      //@ts-ignore
                      window.tidioChatApi.setVisitorData = {
                        distinct_id: token, // Unique visitor ID in your system
                        email: user.emailAddresses[0].emailAddress, // visitor email
                        name: `${user.firstName} ${user.lastName}`, // Visitor name
                        phone: null, //Visitor phone
                      };
                      //@ts-ignore
                      window.tidioChatApi.show();
                      //@ts-ignore
                      window.tidioChatApi.open();
                      //@ts-ignore
                      window.tidioChatApi.messageFromOperator(
                        'Message from operator!'
                      );
                    } else {
                      toast.error(
                        'Chat is not available at the moment due to server issues.'
                      );
                    }
                  }
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                <Alert />
                <span>Chat with us</span>
              </DropdownMenuItem>
              <ReportAnIssue token={token} />
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>
          <Cloud className="mr-2 h-4 w-4" />
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="flex flex-col gap-0 px-2 py-1.5 select-none">
          <p className="font-light text-xs">You are logged in as:</p>
          <p className="font-medium text-xs">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
        <DropdownMenuItem onClick={() => router.push('/app/subscriptions')}>
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Manage subscription</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/app/accounts')}>
          <User className="mr-2 h-4 w-4" />
          <span>Edit account</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            router.push('/login');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MenuDropdown;
