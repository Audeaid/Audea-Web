import { clerkClient } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()

    const email = data.get('email')

    if (!email) throw new Error('email is missing')

    const getUserList = await clerkClient.users.getUserList({
      emailAddress: [email.toString()],
    })

    return NextResponse.json(getUserList)
  } catch (error) {
    console.error(error)
    return NextResponse.error()
  }
}
