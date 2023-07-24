import jwt from 'jsonwebtoken'

export default function signJwt(clerkUserId: string) {
  /**
   * We use client .env just in case if we ever
   * call it in the client
   */
  const token = jwt.sign({ clerkUserId }, process.env.NEXT_PUBLIC_APP_SECRET!)

  return token
}
