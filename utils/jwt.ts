import jwt from 'jsonwebtoken';

export function signJwt(clerkUserId: string) {
  return jwt.sign({ clerkUserId }, process.env.APP_SECRET as string);
}
