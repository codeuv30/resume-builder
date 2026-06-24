import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // Edge-compatible JWT library

// Edge-safe secret (must match your JWT secret)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith('/auth');
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/resume');

  // Get token from cookie (Edge-safe, no Node.js APIs)
  const token = request.cookies.get('token')?.value;

  let isValidToken = false;

  if (token) {
    try {
      // Verify JWT using jose (Edge-compatible, no jsonwebtoken)
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users away from auth pages
  if (isAuthPage && isValidToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*', '/resume/:path*'],
};