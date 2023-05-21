import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('audea_token')?.value;
  const signInProvider = request.cookies.get('audea_signInProvider')?.value;

  const loginUrl = new URL('/login', request.url);

  if (!token && !signInProvider) {
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/app/:path*'],
};
