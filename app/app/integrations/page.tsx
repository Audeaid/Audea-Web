import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Client from './client'
import signJwt from '@/utils/jwt'
import { getIntegrationRequest, getNotionAccount } from './graphql'
import { generateUrl } from '@/helper'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    const notion = await getNotionAccount(token)

    // integration
    const zapier = await getIntegrationRequest(token, 'ZAPIER')
    const todoist = await getIntegrationRequest(token, 'TODOIST')
    const whatsapp = await getIntegrationRequest(token, 'WHATSAPP')
    const sunsama = await getIntegrationRequest(token, 'SUNSAMA')
    const obsidian = await getIntegrationRequest(token, 'OBSIDIAN')
    const monday = await getIntegrationRequest(token, 'MONDAY')
    const gmail = await getIntegrationRequest(token, 'GMAIL')
    const github = await getIntegrationRequest(token, 'GITHUB')
    const evernote = await getIntegrationRequest(token, 'EVERNOTE')
    const craft = await getIntegrationRequest(token, 'CRAFT')
    const clickup = await getIntegrationRequest(token, 'CLICKUP')

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client
          token={token}
          getNotionAccount={notion}
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
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app/integrations')}`)
    return redirect(url.href)
  }
}
