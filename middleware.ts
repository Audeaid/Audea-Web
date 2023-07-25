import { authMiddleware } from '@clerk/nextjs'
import { gql } from '@apollo/client'
import { NextResponse } from 'next/server'
import { middleware } from '@/utils/graphql'

export default authMiddleware({
  async afterAuth(auth, req) {
    const notAllowedUrl = req.nextUrl.pathname === '/notallowed'
    const subscriptionsUrl = /^\/app\/subscriptions(?:\/|$)/.test(req.nextUrl.pathname) // /app/subscriptions/[any]
    const stripeApiUrl = /^\/api\/stripe(?:\/|$)/.test(req.nextUrl.pathname) // /api/stripe/[any]
    const loginUrl = /^\/login(?:\/|$)/.test(req.nextUrl.pathname) // /login/[any]
    const signupUrl = /^\/signup(?:\/|$)/.test(req.nextUrl.pathname) // /signup/[any]
    const errorUrl = /^\/error(?:|$)/.test(req.nextUrl.pathname) // /error?[any]
    const ogUrl = req.nextUrl.pathname === '/og'
    // const baseUrl = req.nextUrl.pathname === '/'

    const redirectNotAllowedUrl = new URL('/notallowed', req.url)
    // const redirectLoginUrl = new URL('/login', req.url)

    if (!loginUrl && !signupUrl && !ogUrl && !errorUrl) {
      if (auth.userId) {
        try {
          const subscription = await checkSubscription(process.env.CHECK_SUBSCRIPTION_SECRET as string, auth.userId)

          if (!subscription) throw new Error('Cannot find subscription')

          const endDate = subscription.endDate
          const notSubscribed = new Date() >= new Date(endDate)

          const doNotRedirectUrl = !notAllowedUrl && !subscriptionsUrl && !stripeApiUrl

          if (notSubscribed && doNotRedirectUrl) {
            return NextResponse.redirect(redirectNotAllowedUrl)
          }
        } catch (error) {
          console.error(error)
        }
      }
    }
  },
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}

interface ICheckSubscription {
  __typename: 'UserSubscription'
  endDate: string
}

const checkSubscription = (secret: string, clerkUserId: string): Promise<ICheckSubscription> => {
  const query = gql`
    query GetUserSubscriptionEDGE($secret: String!, $clerkUserId: String!) {
      getUserSubscriptionEDGE(secret: $secret, clerkUserId: $clerkUserId) {
        endDate
      }
    }
  `

  return new Promise((resolve, reject) => {
    const fetchData = async () => {
      try {
        const { data, error, errors } = await middleware.query({
          query,
          variables: {
            secret,
            clerkUserId,
          },
          fetchPolicy: 'network-only',
        })

        const response = data.getUserSubscriptionEDGE as ICheckSubscription

        if (error) {
          console.error(error)
          reject(error)
        } else if (errors) {
          console.error(errors)
          reject(errors)
        } else {
          resolve(response)
        }
      } catch (e) {
        console.error(e)
        reject(e)
      }
    }

    fetchData()
  })
}
