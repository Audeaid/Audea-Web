import { redirect } from 'next/navigation';
import {
  IGetContentSettings,
  createNewContentSettings,
  getAllContent,
  getContentSettings,
} from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';
import { signJwt } from '@/utils/jwt';

export default async function Page() {
  const { userId: clerkUserId } = auth();

  if (!clerkUserId) redirect('/login');

  const token = signJwt(clerkUserId);

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
