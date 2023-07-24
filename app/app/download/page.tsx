import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Client from './client'
import signJwt from '@/utils/jwt'
import { checkIfVoted, getPlatformVote } from './graphql'
import { generateUrl } from '@/helper'
import { Suspense } from 'react'
import LoadingPage from '@/lib/LoadingPage'

export default async function Page() {
  try {
    const { userId: clerkUserId } = auth()

    if (!clerkUserId) return redirect('/login')

    const token = signJwt(clerkUserId)

    const iOSVote = await getPlatformVote(token, 'IOS')
    const iOSIsVoted = await checkIfVoted(token, 'IOS')

    const iPadOSVote = await getPlatformVote(token, 'IPADOS')
    const iPadOSIsVoted = await checkIfVoted(token, 'IPADOS')

    const macOSVote = await getPlatformVote(token, 'MACOS')
    const macOSIsVoted = await checkIfVoted(token, 'MACOS')

    const androidVote = await getPlatformVote(token, 'ANDROID')
    const androidIsVoted = await checkIfVoted(token, 'ANDROID')

    const androidTabletVote = await getPlatformVote(token, 'ANDROIDTABLET')
    const androidTabletIsVoted = await checkIfVoted(token, 'ANDROIDTABLET')

    const windowsVote = await getPlatformVote(token, 'WINDOWS')
    const windowsIsVoted = await checkIfVoted(token, 'WINDOWS')

    const linuxVote = await getPlatformVote(token, 'LINUX')
    const linuxIsVoted = await checkIfVoted(token, 'LINUX')

    return (
      <Suspense fallback={<LoadingPage />}>
        <Client
          token={token}
          ios={{ initialCount: iOSVote.count, isChecked: iOSIsVoted.voted }}
          ipados={{ initialCount: iPadOSVote.count, isChecked: iPadOSIsVoted.voted }}
          macos={{ initialCount: macOSVote.count, isChecked: macOSIsVoted.voted }}
          windows={{ initialCount: windowsVote.count, isChecked: windowsIsVoted.voted }}
          android={{ initialCount: androidVote.count, isChecked: androidIsVoted.voted }}
          androidTablet={{ initialCount: androidTabletVote.count, isChecked: androidTabletIsVoted.voted }}
          linux={{ initialCount: linuxVote.count, isChecked: linuxIsVoted.voted }}
        />
      </Suspense>
    )
  } catch (error) {
    const e = JSON.stringify(error)
    const url = generateUrl(`/error?message=${encodeURIComponent(e)}&from=${encodeURIComponent('/app/download')}`)
    return redirect(url.href)
  }
}
