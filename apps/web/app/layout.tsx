import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "lil' bites — Feedback",
  description: "Tell us how your lil' bites brownie was. Bite more, worry less.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("antialiased", "font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  )
}
