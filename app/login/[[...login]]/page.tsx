import { AuthenticateWithRedirectCallback, auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Client from './lib';
import { searchUserByClerkId } from './graphql';
import {
  createNewContentSettings,
  createNewUserSubscriptionTrial,
  createUserFromClerk,
  sendNewUserEmail,
} from '@/app/signup/[[...signup]]/lib/Sequence/FifthSequence/script';

export default async function Page({
  params,
  searchParams,
}: {
  params: { login: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId: clerkUserId, user } = auth();

  if (params.login) {
    if (params.login[0] === 'check-user') {
      if (clerkUserId && user) {
        // check if user exist
        const response = await searchUserByClerkId(clerkUserId);

        const userExist = response === null ? false : true;

        if (userExist) {
          redirect('/app');
        } else {
          const referralJwt = (() => {
            if (searchParams) {
              if (searchParams.referralId) {
                return searchParams.referralId as string;
              } else {
                return null;
              }
            } else {
              return null;
            }
          })();

          const response = await createUserFromClerk({
            email: user.emailAddresses[0].emailAddress,
            clerkId: clerkUserId,
            firstName: user.firstName ?? '',
            lastName: user.lastName ?? '',
            referralJwt,
          });

          await createNewUserSubscriptionTrial(response.clerkUserId);

          await createNewContentSettings(response.clerkUserId);

          await sendNewUserEmail({
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName ?? '',
          });

          redirect('/app');
        }
      } else {
        redirect('/login');
      }
    } else if (params.login[0] === 'sso-callback') {
      return <AuthenticateWithRedirectCallback />;
    } else {
      redirect('/login');
    }
  } else {
    if (clerkUserId) {
      redirect('/app');
    } else {
      return <Client />;
    }
  }
}
