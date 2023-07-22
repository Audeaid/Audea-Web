import { redirect } from 'next/navigation'
import { getAllContent } from './graphql'
import Client from './lib'
import { auth } from '@clerk/nextjs'
import { signJwt } from '@/utils/jwt'
import { generateUrl } from '@/utils/url'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    const content = await getAllContent(token)

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client incomingContent={content} clerkUserId={clerkUserId} />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app/saved')}`)
    return redirect(url.href)
  }
}
