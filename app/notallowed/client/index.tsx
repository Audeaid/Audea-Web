'use client'

import { motion } from 'framer-motion'
import SubscribeNowButton from './SubscribeNowButton'
import { ICheckSubscription } from '../graphql'
import RestartTrial from './RestartTrial'
import { useRouter } from 'next/navigation'
import Footer from './Footer'
import Toast from '@/lib/Toast'

interface IClient {
  subscriptionType: ICheckSubscription['type']
  hasExtendedTrial: ICheckSubscription['extended']
  token: string
  stripeCustomerId: string
  clerkUserId: string
}

export default function Client({ subscriptionType, hasExtendedTrial, token, stripeCustomerId, clerkUserId }: IClient) {
  const router = useRouter()
  return (
    <main className='min-h-screen min-w-screen select-none'>
      <motion.section
        className='w-full h-full mx-auto py-20 max-w-[600px] flex flex-col gap-20 sm:px-0 px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SubscribeNowButton
          subscriptionType={subscriptionType}
          stripeCustomerId={stripeCustomerId}
          clerkUserId={clerkUserId}
        />

        {subscriptionType === 'TRIAL' && !hasExtendedTrial && <RestartTrial router={router} token={token} />}

        <Footer token={token} router={router} />
      </motion.section>

      <Toast />
    </main>
  )
}
