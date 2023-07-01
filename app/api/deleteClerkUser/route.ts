import { clerkClient } from '@clerk/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const clerkUserId: string = data.clerkUserId;

    if (!clerkUserId) throw new Error('clerkUserId is missing');

    const response = await clerkClient.users.deleteUser(clerkUserId);

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}
