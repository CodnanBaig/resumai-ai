import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check",
])

// Public API paths that don't require authentication
const PUBLIC_API_PATHS = new Set([
  "/api/ai/models",
  "/api/test-db",
  "/api/debug-db",
  "/api/debug-register",
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Allow specific public API paths
  if (PUBLIC_API_PATHS.has(pathname)) {
    return NextResponse.next()
  }

  // Check for session on all other paths (including dashboard, resume, cover-letter pages and their APIs)
  const session = request.cookies.get("session")?.value
  if (!session) {
    // For API requests, return JSON error
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    // For page requests, redirect to login
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Updated matcher to correctly exclude static assets and internal Next.js paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (handled by the conditional logic above)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .svg, .png, .jpg, .jpeg, .gif, .ico, .css, .js (static assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js)$).*)',
  ],
}
