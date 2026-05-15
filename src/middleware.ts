import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname === '/dashboard' ||
    pathname.startsWith('/leads') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/campaigns') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/analytics') ||
    pathname.startsWith('/conversations') ||
    pathname.startsWith('/settings');

  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/forgot-password');
  
  const isOnboardingRoute = pathname.startsWith('/onboarding');

  const sessionCookie = request.cookies.get('session');
  const hasSession = !!sessionCookie?.value;

  if (isDashboardRoute && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
