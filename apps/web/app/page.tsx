import { FeedbackFlow } from "@/components/feedback-flow"

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const batchParam = params.batch
  const batch = typeof batchParam === "string" ? batchParam : null

  return (
    <main className="flex min-h-svh flex-col bg-background">
      <FeedbackFlow batch={batch} />
    </main>
  )
}
