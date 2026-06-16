import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('sastika_token')?.value;
    const userCookie = request.cookies.get('sastika_user')?.value;

    if (!token && !userCookie) {
      const hasLocalStorageHint = request.headers.get('referer');
      if (!hasLocalStorageHint) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
