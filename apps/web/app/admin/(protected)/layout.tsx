import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { isAuthenticated } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Dashboard — lil' bites",
}

// This is the actual authentication gate. proxy.ts redirects unauthenticated
// requests first, but that is a convenience: proxy matchers can be bypassed,
// a server-rendered check cannot.
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!(await isAuthenticated())) redirect("/admin/login")

  return children
}
