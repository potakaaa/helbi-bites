import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session"

const LOGIN_PATH = "/admin/login"

// This is a redirect for the sake of UX only. The real gate is the server-side
// check in app/admin/layout.tsx — never rely on the proxy alone for auth.
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === LOGIN_PATH) return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (await verifySessionToken(token)) return NextResponse.next()

  const loginUrl = new URL(LOGIN_PATH, request.url)
  const from = request.nextUrl.pathname + request.nextUrl.search
  if (from !== "/admin") loginUrl.searchParams.set("from", from)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ["/admin/:path*"],
}
