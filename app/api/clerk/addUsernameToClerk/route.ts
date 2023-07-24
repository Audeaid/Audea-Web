import { NextResponse, NextRequest } from 'next/server'
import { clerkClient } from '@clerk/nextjs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    const clerkUserId: string = data.clerkUserId
    const username: string = data.username

    if (!clerkUserId || !username) throw new Error('clerkUserId is missing')

    const response = await clerkClient.users.updateUser(clerkUserId, {
      username,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
