import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Navbar from '@/lib/Navbar'
import Toast from '@/lib/Toast'
import signJwt from '@/utils/jwt'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId: clerkUserId } = auth()

  if (!clerkUserId) redirect('/login')

  const token = signJwt(clerkUserId)

  return (
    <main className='min-w-screen min-h-screen overflow-x-hidden'>
      <Navbar token={token as string} />

      <section className={`md:mt-14 mt-20 px-4 max-w-[1300px] mx-auto w-full pb-20 sm:px-10`}>{children}</section>

      <Toast />
    </main>
  )
}
