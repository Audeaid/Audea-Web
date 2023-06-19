import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { generateUrl } from '@/utils/url';

export default function Page({
  params,
  searchParams,
}: {
  params: { signup: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  try {
    const { userId: clerkUserId } = auth();
    const token = clerkUserId;

    if (token) {
      redirect('/app');
    } else {
      if (params.signup) {
        redirect('/signup');
      } else {
        return (
          <Client
            initialEmail={
              searchParams['email'] ? searchParams['email'].toString() : null
            }
            initialFirstName={
              searchParams['firstName']
                ? searchParams['firstName'].toString()
                : null
            }
            initialLastName={
              searchParams['lastName']
                ? searchParams['lastName'].toString()
                : null
            }
            referralJwt={
              searchParams['token'] ? searchParams['token'].toString() : null
            }
          />
        );
      }
    }
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        '/signup'
      )}`
    );
    return redirect(url.href);
  }
}
