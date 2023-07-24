import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs'

export default function Page() {
  const { userId: clerkUserId } = auth()

  if (clerkUserId) {
    return redirect('/app')
  } else {
    return redirect('/login')
  }
}
