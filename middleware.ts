import { authMiddleware } from '@clerk/nextjs';
import client from '@/utils/middlewareGraphql';
import { gql } from '@apollo/client';
import { NextResponse } from 'next/server';

export default authMiddleware({
  async afterAuth(auth, req, _evt) {
    const notAllowedUrl = req.nextUrl.pathname === '/notallowed';
    const subscriptionsUrl = /^\/app\/subscriptions(?:\/|$)/.test(
      req.nextUrl.pathname
    ); // /app/subscriptions/[any]
    const stripeApiUrl = /^\/api\/stripe(?:\/|$)/.test(req.nextUrl.pathname); // /api/stripe/[any]
    const loginUrl = /^\/login(?:\/|$)/.test(req.nextUrl.pathname); // /login/[any]
    const signupUrl = /^\/signup(?:\/|$)/.test(req.nextUrl.pathname); // /signup/[any]
    const ogUrl = req.nextUrl.pathname === '/og';

    if (!loginUrl && !signupUrl && !ogUrl) {
      if (auth.userId) {
        try {
          const subscription = await checkSubscription(
            process.env.CHECK_SUBSCRIPTION_SECRET as string,
            auth.userId
          );
          const endDate = subscription.endDate;
          const notSubscribed = new Date() >= new Date(endDate);

          if (
            notSubscribed &&
            !notAllowedUrl &&
            !subscriptionsUrl &&
            !stripeApiUrl
          ) {
            const notAllowedUrl = new URL('/notallowed', req.url);
            return NextResponse.redirect(notAllowedUrl);
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

interface ICheckSubscription {
  __typename: 'UserSubscription';
  endDate: string;
}

const checkSubscription = (
  secret: string,
  clerkUserId: string
): Promise<ICheckSubscription> => {
  const query = gql`
    query GetUserSubscriptionEDGE($secret: String!, $clerkUserId: String!) {
      getUserSubscriptionEDGE(secret: $secret, clerkUserId: $clerkUserId) {
        endDate
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getUserSubscriptionEDGE },
        } = await client.query({
          query,
          variables: {
            secret,
            clerkUserId,
          },
          fetchPolicy: 'network-only',
        });

        resolve(getUserSubscriptionEDGE);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
