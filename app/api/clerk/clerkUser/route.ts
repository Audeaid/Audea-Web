import { clerkClient } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/dist/types/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const clerkUserId: string | null | undefined = data.clerkUserId
    const email: string | null | undefined = data.email

    if (!clerkUserId && !email) throw new Error('Cannot have both clerkUserId and email missing')

    let response: User | null = null

    if (clerkUserId) {
      response = await clerkClient.users.getUser(clerkUserId)
    }

    if (email) {
      const user = await clerkClient.users.getUserList({
        emailAddress: [email.toString()],
      })

      if (user.length === 0) {
        response = null
      } else {
        response = user[0]
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
