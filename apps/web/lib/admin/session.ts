// Session helpers for the admin dashboard.
//
// Deliberately Web Crypto only (no `node:crypto`), because this module is
// imported both by `proxy.ts` — which Next may deploy to the CDN edge — and by
// server components running under Node.

export const SESSION_COOKIE = "lb_admin"

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000

const encoder = new TextEncoder()

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (need at least 32 characters)."
    )
  }

  return secret
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  )

  return toBase64Url(new Uint8Array(signature))
}

function toBase64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Length-independent so a mismatch never leaks where it diverged.
export function safeEqual(a: string, b: string) {
  const aBytes = encoder.encode(a)
  const bBytes = encoder.encode(b)
  const length = Math.max(aBytes.length, bBytes.length)

  let diff = aBytes.length ^ bBytes.length

  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0)
  }

  return diff === 0
}

export async function createSessionToken(now = Date.now()) {
  const expiry = String(now + SESSION_TTL_MS)
  return `${expiry}.${await sign(expiry)}`
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false

  const separator = token.indexOf(".")
  if (separator < 1) return false

  const expiry = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  const expiresAt = Number(expiry)
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false

  try {
    return safeEqual(signature, await sign(expiry))
  } catch {
    // A missing ADMIN_SESSION_SECRET must fail closed, not throw into the proxy.
    return false
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  }
}
