import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')
  const isMapRoute = request.nextUrl.pathname.startsWith('/map')

  if (isMapRoute && !accessToken) {
    return NextResponse.redirect(new URL('/sign', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/map/:path*']
}