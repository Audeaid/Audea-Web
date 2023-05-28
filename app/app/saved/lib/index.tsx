'use client';

import { useRouter } from 'next/navigation';
import { IGetAllContent } from '../graphql';
import Content from './Content';
import EmptyContent from './EmptyContent';

export default function Client({
  incomingContent,
  userId,
}: {
  incomingContent: IGetAllContent[] | null;
  userId: string;
}) {
  const router = useRouter();

  if (incomingContent !== null) {
    return <Content incomingContent={incomingContent} userId={userId} />;
  } else {
    return <EmptyContent router={router} />;
  }
}
