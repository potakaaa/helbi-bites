"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import {
  SESSION_COOKIE,
  createSessionToken,
  safeEqual,
  sessionCookieOptions,
} from "@/lib/admin/session"

export type LoginState = { error: string | null }

// Serverless functions share no memory, so there is no real brute-force
// counter to keep. A fixed delay on every attempt is what we can honestly
// offer; the actual protection is a long, random ADMIN_PASSWORD.
const ATTEMPT_DELAY_MS = 400

// Only ever bounce back into the admin area, so `from` can't be used to turn
// the login page into an open redirect.
function safeDestination(from: string) {
  if (!from.startsWith("/admin") || from.startsWith("//")) return "/admin"
  return from
}

export async function login(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "")
  const from = safeDestination(String(formData.get("from") ?? "/admin"))
  const expected = process.env.ADMIN_PASSWORD

  await new Promise((resolve) => setTimeout(resolve, ATTEMPT_DELAY_MS))

  if (!expected) {
    return { error: "Admin login isn't configured on this deployment." }
  }

  if (!safeEqual(password, expected)) {
    return { error: "Incorrect password." }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, await createSessionToken(), sessionCookieOptions())

  redirect(from)
}

export async function logout() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect("/admin/login")
}
