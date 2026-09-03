import { NextResponse } from "next/server"

import { isAuthenticated } from "@/lib/admin/auth"
import { getExportRows } from "@/lib/admin/queries"

const COLUMNS = {
  feedback: [
    "created_at",
    "batch",
    "rating",
    "texture",
    "sweetness",
    "chocolate_flavor",
    "portion_size",
    "buy_again",
    "comment",
  ],
  subscribers: ["consented_at", "email", "marketing_consent", "batch"],
} as const

// Spreadsheets execute a cell that opens with one of these, so user-written
// comments get a leading apostrophe before they ever reach Excel.
const FORMULA_PREFIXES = ["=", "+", "-", "@", "\t", "\r"]

function toCsvValue(value: unknown) {
  if (value === null || value === undefined) return ""

  let text = String(value)

  if (FORMULA_PREFIXES.some((prefix) => text.startsWith(prefix))) {
    text = `'${text}`
  }

  return `"${text.replace(/"/g, '""')}"`
}

export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 })
  }

  const type = new URL(request.url).searchParams.get("type")

  if (type !== "feedback" && type !== "subscribers") {
    return NextResponse.json(
      { error: "type must be 'feedback' or 'subscribers'." },
      { status: 400 }
    )
  }

  let rows: Record<string, unknown>[]

  try {
    rows = (await getExportRows(type)) as unknown as Record<string, unknown>[]
  } catch (error) {
    console.error("[admin:export]", error)
    return NextResponse.json(
      { error: "Couldn't build the export." },
      { status: 500 }
    )
  }

  const columns = COLUMNS[type]
  const lines = [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => toCsvValue(row[column])).join(",")
    ),
  ]

  const filename = `lil-bites-${type}-${new Date().toISOString().slice(0, 10)}.csv`

  // The BOM keeps Excel from mangling non-ASCII characters in comments.
  return new NextResponse(`\uFEFF${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
