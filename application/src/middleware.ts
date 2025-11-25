import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/api/auth',
];

// Routes that require authentication
const protectedRoutes = [
  '/settings',
  '/flow',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API auth routes
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    try {
      // Better Auth handles session validation via cookies
      // We'll check the session by calling the auth API
      const sessionResponse = await fetch(
        new URL('/api/auth/session', request.url),
        {
          headers: {
            cookie: request.headers.get('cookie') || '',
          },
        }
      );

      const session = await sessionResponse.json();

      if (!session?.user) {
        // Redirect to login with return URL
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      // If session check fails, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

