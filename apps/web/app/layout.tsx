import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

import { ServiceWorkerRegister } from "@/components/service-worker-register"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "lil' bites — Feedback",
  description: "Tell us how your lil' bites brownie was. Bite more, worry less.",
  // Lets iOS launch the installed app without Safari's chrome.
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "lil' bites",
  },
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
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}
