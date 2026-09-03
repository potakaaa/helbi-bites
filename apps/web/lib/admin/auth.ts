import "server-only"

import { cookies } from "next/headers"

import { SESSION_COOKIE, verifySessionToken } from "@/lib/admin/session"

export async function isAuthenticated() {
  const store = await cookies()
  return verifySessionToken(store.get(SESSION_COOKIE)?.value)
}
