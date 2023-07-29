import jwt from 'jsonwebtoken'
import { PUBLIC_APP_SECRET } from '../constant'

export default function signJwt(clerkUserId: string) {
  /**
   * We use client .env just in case if we ever
   * call it in the client
   */
  const token = jwt.sign({ clerkUserId }, PUBLIC_APP_SECRET)

  return token
}
