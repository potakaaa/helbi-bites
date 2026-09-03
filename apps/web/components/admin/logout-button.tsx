import { SignOutIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@workspace/ui/components/button"
import { logout } from "@/app/admin/login/actions"

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="ghost"
        size="icon-sm"
        aria-label="Sign out"
        title="Sign out"
      >
        <SignOutIcon className="size-4" />
      </Button>
    </form>
  )
}
