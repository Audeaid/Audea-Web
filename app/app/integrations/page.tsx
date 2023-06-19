import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Client from './lib';
import { signJwt } from '@/utils/jwt';
import { getIntegrationRequest } from './graphql';
import { generateUrl } from '@/utils/url';

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth();

    if (!clerkUserId) redirect('/login');

    const token = signJwt(clerkUserId);

    const notion = await getIntegrationRequest(token, 'NOTION');
    const zapier = await getIntegrationRequest(token, 'ZAPIER');
    const todoist = await getIntegrationRequest(token, 'TODOIST');
    const whatsapp = await getIntegrationRequest(token, 'WHATSAPP');
    const sunsama = await getIntegrationRequest(token, 'SUNSAMA');
    const obsidian = await getIntegrationRequest(token, 'OBSIDIAN');
    const monday = await getIntegrationRequest(token, 'MONDAY');
    const gmail = await getIntegrationRequest(token, 'GMAIL');
    const github = await getIntegrationRequest(token, 'GITHUB');
    const evernote = await getIntegrationRequest(token, 'EVERNOTE');
    const craft = await getIntegrationRequest(token, 'CRAFT');
    const clickup = await getIntegrationRequest(token, 'CLICKUP');

    return (
      <Client
        token={token}
        notionInitialState={notion ? notion.requested : false}
        clickupInitialState={clickup ? clickup.requested : false}
        craftInitialState={craft ? craft.requested : false}
        evernoteInitialState={evernote ? evernote.requested : false}
        githubInitialState={github ? github.requested : false}
        gmailInitialState={gmail ? gmail.requested : false}
        mondayInitialState={monday ? monday.requested : false}
        obsidianInitialState={obsidian ? obsidian.requested : false}
        sunsamaInitialState={sunsama ? sunsama.requested : false}
        todoistInitialState={todoist ? todoist.requested : false}
        whatsappInitialState={whatsapp ? whatsapp.requested : false}
        zapierInitialState={zapier ? zapier.requested : false}
      />
    );
  } catch (error) {
    const e = JSON.stringify(error);
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        '/app/integrations'
      )}`
    );
    return redirect(url.href);
  }
}
