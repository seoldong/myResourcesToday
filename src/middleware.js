import { NextResponse } from 'next/server';

export function middleware(request) {
  const redirectCount = parseInt(request.headers.get('x-redirect-count') || '0');
  if (redirectCount > 10) {
    return new NextResponse('Too many redirects', { status: 500 });
  }

  if (request.nextUrl.pathname.startsWith('/membership')) {
    const session = request.cookies.get('session');
    if (!session && request.nextUrl.pathname !== '/login') {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.headers.set('x-redirect-count', (redirectCount + 1).toString());
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/membership/:path*']
};