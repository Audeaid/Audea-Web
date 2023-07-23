import { redirect } from 'next/navigation'
import { IContentSettings, createNewContentSettings, getContentSettings } from './graphql'
import Client from './client'
import { auth } from '@clerk/nextjs'
import signJwt from '@/utils/jwt'
import { generateUrl } from '@/helper'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    const response = await getContentSettings(token)

    let contentSettings: IContentSettings

    if (!response) {
      contentSettings = await createNewContentSettings(token)
    } else {
      contentSettings = response
    }

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client contentSettings={contentSettings} token={token} />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app/settings')}`)
    return redirect(url.href)
  }
}
