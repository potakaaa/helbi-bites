import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@workspace/ui/components/button"

export function ExportLink({
  type,
  children,
}: {
  type: "feedback" | "subscribers"
  children: React.ReactNode
}) {
  return (
    <Button
      render={<a href={`/api/admin/export?type=${type}`} download />}
      nativeButton={false}
      variant="ghost"
      size="sm"
    >
      <DownloadSimpleIcon className="size-3" />
      {children}
    </Button>
  )
}
