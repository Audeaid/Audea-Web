import { AuthenticateWithRedirectCallback, auth } from '@clerk/nextjs';
import { notFound, redirect } from 'next/navigation';
import Client from './lib';
import { searchUserByClerkId } from './graphql';
import {
  createNewContentSettings,
  createNewUserSubscriptionTrial,
  createUserFromClerk,
  sendNewUserEmail,
} from '@/app/signup/[[...signup]]/lib/Sequence/FifthSequence/script';
import axios from 'axios';
import { generateUrl } from '@/utils/url';
import { User } from '@clerk/nextjs/dist/types/server';
import { signJwt } from '@/utils/jwt';

export default async function Page({
  params,
  searchParams,
}: {
  params: { login: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId: clerkUserId } = auth();

  if (params.login) {
    if (params.login[0] === 'check-user') {
      if (clerkUserId) {
        // check if user exist
        const response = await searchUserByClerkId(clerkUserId);

        const userExist = response === null ? false : true;

        if (userExist) {
          return redirect('/app');
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

          const { data: userData }: { data: User } = await axios.post(
            generateUrl('/api/getUserByClerkId').href,
            {
              clerkUserId,
            }
          );

          const email = userData.emailAddresses.find(
            (v) => v.id === userData.primaryEmailAddressId
          )?.emailAddress as string;
          const firstName = userData.firstName as string;
          const lastName = userData.lastName as string;

          const response = await createUserFromClerk({
            email,
            clerkId: clerkUserId,
            firstName,
            lastName,
            referralJwt,
          });

          const token = signJwt(response.clerkUserId);

          await createNewUserSubscriptionTrial(token);

          await createNewContentSettings(token);

          await sendNewUserEmail({
            email,
            name: firstName,
          });

          return redirect('/app');
        }
      } else {
        return redirect('/login');
      }
    } else if (params.login[0] === 'sso-callback') {
      return <AuthenticateWithRedirectCallback />;
    } else {
      return notFound();
    }
  } else {
    if (clerkUserId) {
      return redirect('/app');
    } else {
      return <Client />;
    }
  }
}
