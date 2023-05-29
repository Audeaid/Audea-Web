import { cookies } from 'next/headers';
import {
  IGetContentSettings,
  createNewContentSettings,
  getAllContent,
  getContentSettings,
} from './graphql';
import Client from './lib';

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

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

  console.table(contentSettings);

  return (
    <Client
      token={token}
      hasContent={hasContent}
      contentSettings={contentSettings}
    />
  );
}
