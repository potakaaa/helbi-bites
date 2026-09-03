import { Skeleton } from "@workspace/ui/components/skeleton"

export default function Loading() {
  return (
    <main className="min-h-svh bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5 pt-2">
          <Skeleton className="size-7 rounded-md" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="ml-auto size-8 rounded-md" />
        </div>

        <Skeleton className="h-9 w-full max-w-sm rounded-lg" />

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-[300px] rounded-xl" />
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </main>
  )
}
