import { getGeneratedNotionPage, getNotionAccount, getOneContent, getSharedContentByContentId } from './graphql'
import Client from './lib'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'
import { signJwt } from '@/utils/jwt'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'
import { generateUrl } from '@/utils/url'

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id

  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    const content = await getOneContent(token, id)

    let initialNotionPageUrl: string | null = null

    let notionAccountConnected = false

    const notionAccount = await getNotionAccount(token)

    if (notionAccount !== null) {
      notionAccountConnected = true
      const generatedNotionPage = await getGeneratedNotionPage(token, id)

      initialNotionPageUrl = generatedNotionPage ? generatedNotionPage.url : null
    }

    const sharedContent = await getSharedContentByContentId(token, id)

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client
          content={content}
          token={token}
          id={id}
          initialNotionPageUrl={initialNotionPageUrl}
          notionAccountConnected={notionAccountConnected}
          sharedContent={sharedContent}
        />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(`/app/saved/${id}`)}`)
    return redirect(url.href)
  }
}
