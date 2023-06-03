'use client';

import { useRouter } from 'next/navigation';
import { IGetAllContent } from '../graphql';
import Content from './Content';
import EmptyContent from './EmptyContent';

export default function Client({
  incomingContent,
  clerkUserId,
}: {
  incomingContent: IGetAllContent[] | null;
  clerkUserId: string;
}) {
  const router = useRouter();

  if (incomingContent !== null) {
    return (
      <Content incomingContent={incomingContent} clerkUserId={clerkUserId} />
    );
  } else {
    return <EmptyContent router={router} />;
  }
}
