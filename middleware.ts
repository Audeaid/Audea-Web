import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import client from '$utils/graphql';
import { gql } from '@apollo/client';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('audea_token')?.value;
  const signInProvider = request.cookies.get('audea_signInProvider')?.value;

  const loginUrl = new URL('/login', request.url);

  if (!token || !signInProvider) {
    return NextResponse.redirect(loginUrl);
  } else {
    const subscription = await checkSubscription(token);
    const endDate = subscription.endDate;
    const notSubscribed = new Date() >= new Date(endDate);

    const notAllowedUrl = new URL('/notallowed', request.url);

    if (notSubscribed) {
      return NextResponse.redirect(notAllowedUrl);
    }
  }
}

export const config = {
  matcher: ['/app/:path*'],
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
