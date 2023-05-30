import { cookies } from 'next/headers';
import {
  IGetContentSettings,
  createNewContentSettings,
  getContentSettings,
} from './graphql';
import Client from './lib';

export default async function Page() {
  const cookieStore = cookies();
  const token = cookieStore.get('audea_token')?.value;
  const signInProvider = cookieStore.get('audea_signInProvider')?.value;

  if (!token || !signInProvider)
    throw new Error('Token and signInProvider is null');

  const response = await getContentSettings(token);

  let contentSettings: IGetContentSettings;

  if (!response) {
    contentSettings = await createNewContentSettings(token);
  } else {
    contentSettings = response;
  }

  return <Client contentSettings={contentSettings} token={token} />;
}
