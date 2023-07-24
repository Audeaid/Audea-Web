import { notFound, redirect } from 'next/navigation'
import Notion from './lib/Notion'
import { auth } from '@clerk/nextjs'
import signJwt from '@/utils/jwt'

interface Props {
  params: { connections: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function Page({ params, searchParams }: Props) {
  const { userId: clerkUserId } = auth()

  if (!clerkUserId) return redirect('/login')

  const token = signJwt(clerkUserId)

  if (params.connections) {
    if (params.connections[0] === 'notion') {
      const code = searchParams.code

      if (code) {
        return <Notion code={code.toString()} token={token} />
      } else {
        return notFound()
      }
    } else {
      return notFound()
    }
  } else {
    return notFound()
  }
}
