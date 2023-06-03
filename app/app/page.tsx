import { redirect } from 'next/navigation';
import {
  IGetContentSettings,
  createNewContentSettings,
  getAllContent,
  getContentSettings,
} from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export default async function Page() {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (!token) redirect('/login');

  const content = await getAllContent(token);
  let hasContent: boolean = false;
  if (content !== null) hasContent = true;

  const response = await getContentSettings(token);

  let contentSettings: IGetContentSettings;

  if (!response) {
    contentSettings = await createNewContentSettings(token);
  } else {
    contentSettings = response;
  }

  return (
    <Client
      token={token}
      hasContent={hasContent}
      contentSettings={contentSettings}
    />
  );
}
