import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (token) redirect('/app');

  return (
    <Client
      initialEmail={
        searchParams['email'] ? searchParams['email'].toString() : null
      }
      initialFirstName={
        searchParams['firstName'] ? searchParams['firstName'].toString() : null
      }
      initialLastName={
        searchParams['lastName'] ? searchParams['lastName'].toString() : null
      }
      referralJwt={
        searchParams['token'] ? searchParams['token'].toString() : null
      }
    />
  );
}
