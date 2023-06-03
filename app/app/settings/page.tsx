import {
  IGetContentSettings,
  createNewContentSettings,
  getContentSettings,
} from './graphql';
import Client from './lib';
import { auth } from '@clerk/nextjs';

export default async function Page() {
  const { userId: clerkUserId } = auth();
  const token = clerkUserId;

  if (!token) throw new Error('Token is null');

  const response = await getContentSettings(token);

  let contentSettings: IGetContentSettings;

  if (!response) {
    contentSettings = await createNewContentSettings(token);
  } else {
    contentSettings = response;
  }

  return <Client contentSettings={contentSettings} token={token} />;
}
