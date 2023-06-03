import { authMiddleware } from '@clerk/nextjs';
import client from '@/utils/middlewareGraphql';
import { gql } from '@apollo/client';
import { NextResponse } from 'next/server';

export default authMiddleware({
  async afterAuth(auth, req, _evt) {
    if (auth.userId) {
      try {
        const subscription = await checkSubscription(auth.userId);
        const endDate = subscription.endDate;
        const notSubscribed = new Date() >= new Date(endDate);

        if (notSubscribed && req.nextUrl.pathname !== '/notallowed') {
          const notAllowedUrl = new URL('/notallowed', req.url);
          return NextResponse.redirect(notAllowedUrl);
        }
      } catch (error) {
        console.error(error);
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

const checkSubscription = (token: string): Promise<ICheckSubscription> => {
  const query = gql`
    query GetUserSubscription {
      getUserSubscription {
        endDate
      }
    }
  `;

  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const {
          data: { getUserSubscription },
        } = await client.query({
          query,
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
          fetchPolicy: 'network-only',
        });

        resolve(getUserSubscription);
      } catch (e) {
        reject(e);
      }
    })();
  });
};
