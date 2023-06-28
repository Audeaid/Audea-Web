import { NextResponse, NextRequest } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const clerkUserId: string = data.clerkUserId;

    if (!clerkUserId) throw new Error('clerkUserId is missing');

    const getUserList = await clerkClient.users.getUser(clerkUserId);

    return NextResponse.json(getUserList);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
