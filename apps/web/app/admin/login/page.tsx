import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { BrandHeader } from "@/components/brand-header"
import { LoginForm } from "@/app/admin/login/login-form"
import { isAuthenticated } from "@/lib/admin/auth"

export const metadata: Metadata = {
  title: "Sign in — lil' bites",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  if (await isAuthenticated()) redirect("/admin")

  const params = await searchParams
  const from = typeof params.from === "string" ? params.from : "/admin"

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background px-6 py-12 pb-[calc(3rem+env(safe-area-inset-bottom))]">
      <BrandHeader />

      <div className="flex w-full max-w-xs flex-col gap-5">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-base font-semibold tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-muted-foreground">
            Enter the admin password to see your feedback.
          </p>
        </div>

        <LoginForm from={from} />
      </div>
    </main>
  )
}
