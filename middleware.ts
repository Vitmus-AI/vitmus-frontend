import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_COOKIE_NAME = 'vitmus_access_token'

const protectedRoutes = ['/', '/contacts', '/orders', '/appointments', '/platforms']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(`${route}/`))
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/contacts/:path*', '/orders/:path*', '/appointments/:path*', '/platforms/:path*'],
}
