import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Client from './client'
import { generateUrl } from '@/helper'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app/how-audea-works')}`,
    )
    return redirect(url.href)
  }
}
