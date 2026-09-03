export function formatCount(value: number | null) {
  if (value === null) return "—"
  return new Intl.NumberFormat("en-GB").format(value)
}

export function formatRating(value: number | null) {
  if (value === null) return "—"
  return value.toFixed(1)
}

export function formatPercent(value: number | null, places = 0) {
  if (value === null) return "—"
  return `${value.toFixed(places)}%`
}

export function formatDelta(value: number | null, suffix = "") {
  if (value === null || value === 0) return null
  const sign = value > 0 ? "+" : "−"
  return `${sign}${Math.abs(value).toFixed(Math.abs(value) < 10 ? 1 : 0)}${suffix}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 86_400_000],
  ["month", 30 * 86_400_000],
  ["week", 7 * 86_400_000],
  ["day", 86_400_000],
  ["hour", 3_600_000],
  ["minute", 60_000],
]

export function formatRelative(iso: string, now = Date.now()) {
  const elapsed = new Date(iso).getTime() - now
  const formatter = new Intl.RelativeTimeFormat("en-GB", { numeric: "auto" })

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(elapsed) >= ms) {
      return formatter.format(Math.round(elapsed / ms), unit)
    }
  }

  return "just now"
}
