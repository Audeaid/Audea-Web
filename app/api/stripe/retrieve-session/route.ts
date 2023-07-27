import { NextResponse } from 'next/server'
import { stripeServer } from '@/utils/stripe'

export async function POST(req: Request) {
  const data = await req.json()

  const sessionId: string | null | undefined = data.sessionId

  if (!sessionId) throw new Error('sessionId is missing')

  try {
    const session = await stripeServer.checkout.sessions.retrieve(sessionId)

    return NextResponse.json(session)
  } catch (err) {
    console.error(err)
    return NextResponse.error()
  }
}
