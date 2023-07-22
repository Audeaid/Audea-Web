import { auth } from '@clerk/nextjs'
import Client from './lib'
import { redirect } from 'next/navigation'
import { signJwt } from '@/utils/jwt'
import { IGetStripeCustomer, checkSubscription, createStripeCustomer, getStripeCustomer } from './graphql'
import { generateUrl } from '@/utils/url'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'
import { stripeServer } from '@/utils/stripe'

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    let stripeCustomer: IGetStripeCustomer | null = null

    const response = await getStripeCustomer(token)

    if (response !== null) {
      stripeCustomer = response
    } else {
      const newStripeCustomer = await createStripeCustomer(token)
      stripeCustomer = newStripeCustomer
    }

    const { data: invoices } = await stripeServer.invoices.list({
      customer: stripeCustomer.stripeCustomerId,
    })

    const currentSubscription = await checkSubscription(token)

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client
          stripeCustomerId={stripeCustomer.stripeCustomerId}
          clerkUserId={clerkUserId}
          currentSubscription={currentSubscription}
          invoices={invoices}
        />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(`/app/subscriptions`)}`)
    return redirect(url.href)
  }
}
