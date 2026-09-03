import type { Metadata } from "next"

export const metadata: Metadata = {
  // Keep the whole admin area out of search results.
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
