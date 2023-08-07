import { redirect } from 'next/navigation'
import { IGetContentSettings, createNewContentSettings, getAllContent, getContentSettings } from './graphql'
import Client from './client'
import { auth } from '@clerk/nextjs'
import signJwt from '@/utils/jwt'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'
import { generateUrl } from '@/helper'
import { searchUserByClerkId } from '../login/[[...login]]/graphql'

interface Prop {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ searchParams }: Prop) {
  const startRecording = searchParams.record === 'true' ? true : false

  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const userByClerkId = await searchUserByClerkId(clerkUserId)

    const userExist = userByClerkId === null ? false : true

    if (userExist) {
      const token = signJwt(clerkUserId)

      const content = await getAllContent(token)
      let hasContent: boolean = false
      if (content !== null) hasContent = true

      const response = await getContentSettings(token)

      let contentSettings: IGetContentSettings

      if (!response) {
        contentSettings = await createNewContentSettings(token)
      } else {
        contentSettings = response
      }

      return (
        <Suspense fallback={<LoadingPage />}>
          <Client
            token={token}
            hasContent={hasContent}
            contentSettings={contentSettings}
            startRecording={startRecording}
          />
        </Suspense>
      )
    } else {
      return redirect('/login/check-user')
    }
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app')}`)
    return redirect(url.href)
  }
}
