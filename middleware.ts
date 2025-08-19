import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/check",
  "/api/ai/models",
])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.has(pathname) || pathname.startsWith("/api/cover-letter") || pathname.startsWith("/api/ai/")) {
    return NextResponse.next()
  }

  const session = request.cookies.get("session")?.value
  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|static|.*\\.\
  (?:svg|png|jpg|jpeg|gif|ico|css|js)\$).*)"],
}
