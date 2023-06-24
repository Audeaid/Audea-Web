import { redirect } from 'next/navigation';
import Client from './lib';
import { auth } from '@clerk/nextjs';

import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const firstName = searchParams['firstName'];
  const lastName = searchParams['lastName'];

  // optionally access and extend (rather than replace) parent metadata
  const previousImagesOG = (await parent).openGraph?.images || [];
  const previousImagesTwitter = (await parent).twitter?.images || [];

  return {
    openGraph: {
      images: [
        `https://app.audea.id/og?firstName=${firstName}&lastName=${lastName}`,
        ...previousImagesOG,
      ],
    },
    twitter: {
      images: [
        `https://app.audea.id/og?firstName=${firstName}&lastName=${lastName}`,
        ...previousImagesTwitter,
      ],
    },
  };
}

export default function Page({
  params,
  searchParams,
}: {
  params: { signup: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
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
}
