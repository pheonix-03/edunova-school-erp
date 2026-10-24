import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const COOKIE_NAME = 'edunova_school_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasSession = request.cookies.has(COOKIE_NAME) && !!request.cookies.get(COOKIE_NAME)?.value;

  // If already logged in and visiting /login, redirect to /
  if (pathname === '/login') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // If unauthenticated and accessing a protected UI page, redirect to /login
  if (!hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all UI routes, excluding API routes, static files, and icons:
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
