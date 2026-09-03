"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

import { login, type LoginState } from "@/app/admin/login/actions"

const INITIAL: LoginState = { error: null }

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? "Checking…" : "Sign in"}
    </Button>
  )
}

export function LoginForm({ from }: { from: string }) {
  const [state, formAction] = useActionState(login, INITIAL)

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <input type="hidden" name="from" value={from} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="h-11"
          aria-describedby={state.error ? "login-error" : undefined}
          aria-invalid={state.error ? true : undefined}
        />
      </div>

      {state.error ? (
        <p id="login-error" role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
