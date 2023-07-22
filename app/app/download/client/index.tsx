'use client'

import { motion } from 'framer-motion'
import InstallButton from '@/lib/InstallButton'
import { gql } from '@apollo/client'
import { faAndroid, faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons'
import PlatformCard from './PlatformCard'

interface Props {
  token: string
  initialIOSCount: number
  isCheckedIOS: boolean

  initialIPadOSCount: number
  isCheckedIPadOS: boolean

  initialMacOSCount: number
  isCheckedMacOS: boolean

  initialAndroidCount: number
  isCheckedAndroid: boolean

  initialAndroidTabletCount: number
  isCheckedAndroidTablet: boolean

  initialWindowsCount: number
  isCheckedWindows: boolean

  initialLinuxCount: number
  isCheckedLinux: boolean
}

export default function Client({
  token,
  initialIOSCount,
  isCheckedIOS,

  initialIPadOSCount,
  isCheckedIPadOS,

  initialMacOSCount,
  isCheckedMacOS,

  initialAndroidCount,
  isCheckedAndroid,

  initialAndroidTabletCount,
  isCheckedAndroidTablet,

  initialWindowsCount,
  isCheckedWindows,

  initialLinuxCount,
  isCheckedLinux,
}: Props) {
  const platforms = [
    {
      initialCount: initialIOSCount,
      isChecked: isCheckedIOS,
      subscriptionQuery: gql`
        subscription IOSVoteSubscription {
          iOSVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'iOSVoteSubscription',
      icon: faApple,
      title: 'iOS',
      description: 'iOS is a mobile operating system developed by Apple.',
      platform: 'IOS',
      priority: 'High priority',
    },

    {
      initialCount: initialAndroidCount,
      isChecked: isCheckedAndroid,
      subscriptionQuery: gql`
        subscription AndroidVoteSubscription {
          androidVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'androidVoteSubscription',
      icon: faAndroid,
      title: 'Android (phone)',
      description: 'We deliberately distinguished the phone and tablet version of Android.',
      platform: 'ANDROID',
      priority: 'High priority',
    },

    {
      initialCount: initialMacOSCount,
      isChecked: isCheckedMacOS,
      subscriptionQuery: gql`
        subscription MacOSVoteSubscription {
          macOSVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'macOSVoteSubscription',
      icon: faApple,
      title: 'macOS',
      description: 'macOS is a desktop operating system developed by Apple.',
      platform: 'MACOS',
      priority: 'High priority',
    },

    {
      initialCount: initialWindowsCount,
      isChecked: isCheckedWindows,
      subscriptionQuery: gql`
        subscription WindowsVoteSubscription {
          windowsVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'windowsVoteSubscription',
      icon: faWindows,
      title: 'Windows',
      description: 'Windows is a proprietary operating system developed by Microsoft.',
      platform: 'WINDOWS',
      priority: 'Medium priority',
    },

    {
      initialCount: initialIPadOSCount,
      isChecked: isCheckedIPadOS,
      subscriptionQuery: gql`
        subscription IPadOSVoteSubscription {
          iPadOSVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'iPadOSVoteSubscription',
      icon: faApple,
      title: 'iPadOS',
      description: 'iPadOS is a mobile operating system developed by Apple for their iPad.',
      platform: 'IPADOS',
      priority: 'Medium priority',
    },

    {
      initialCount: initialAndroidTabletCount,
      isChecked: isCheckedAndroidTablet,
      subscriptionQuery: gql`
        subscription AndroidTabletVoteSubscription {
          androidTabletVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'androidTabletVoteSubscription',
      icon: faAndroid,
      title: 'Android (tablet)',
      description: 'We deliberately distinguished the phone and tablet version of Android.',
      platform: 'ANDROIDTABLET',
      priority: 'Low priority',
    },

    {
      initialCount: initialLinuxCount,
      isChecked: isCheckedLinux,
      subscriptionQuery: gql`
        subscription LinuxVoteSubscription {
          linuxVoteSubscription {
            platform
            vote
          }
        }
      `,
      subscriptionName: 'linuxVoteSubscription',
      icon: faLinux,
      title: 'Linux',
      description: 'Linux is a free and open-source operating system kernel.',
      platform: 'LINUX',
      priority: 'Low priority',
    },
  ]
  return (
    <motion.section className='flex flex-col gap-16' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className='flex flex-col gap-4 select-none'>
        <h1 className='font-bold text-4xl'>Download app</h1>

        <p className='text-base font-light text-justify'>
          Audea is currently available as a web version, which you can easily install as a Progressive Web App (PWA).
          However, we have exciting plans to develop an app specifically for your platform. Make your voice heard by
          casting your vote below!
        </p>

        <InstallButton />
      </div>
      <div className='flex flex-col items-center justify-center gap-8 select-none'>
        <div className='grid lg:grid-cols-4 lg:grid-rows-2 md:grid-cols-3 md:grid-rows-3 sm:grid-cols-2 sm:grid-rows-4 grid-cols-1 grid-rows-7 justify-items-center gap-4 w-fit h-fit'>
          {platforms.map((v, i) => {
            return (
              <PlatformCard
                key={i}
                token={token}
                initialCount={v.initialCount}
                isChecked={v.isChecked}
                subscriptionQuery={v.subscriptionQuery}
                subscriptionName={v.subscriptionName}
                icon={v.icon}
                title={v.title}
                description={v.description}
                priority={v.priority}
                platform={v.platform}
              />
            )
          })}
        </div>
        <p className='text-sm text-muted-foreground font-light'>Pssh, this vote is using live data!</p>
      </div>
    </motion.section>
  )
}
