import { auth } from '@clerk/nextjs'
import './styles.css'
import { redirect } from 'next/navigation'
import Client from './client'
import { generateUrl } from '@/helper'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default function Page({ params }: { params: { accounts: string } }) {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    return (
      <Suspense fallback={<LoadingPage />}>
        <section className='w-fit h-fit flex items-center justify-start mx-auto text-foreground sm:px-2'>
          <Client />
        </section>
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(
      `/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent(
        `/app/accounts/${params.accounts ? params.accounts[0] : ''}`,
      )}`,
    )
    return redirect(url.href)
  }
}
