import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_HEADERS } from '@/lib/security';
import { GUEST_SESSION_COOKIE } from '@/lib/session';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  for (const header of SECURITY_HEADERS) {
    response.headers.set(header.key, header.value);
  }

  response.headers.set('X-Request-Path', request.nextUrl.pathname);

  if (!request.cookies.get(GUEST_SESSION_COOKIE)?.value) {
    response.cookies.set(GUEST_SESSION_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
