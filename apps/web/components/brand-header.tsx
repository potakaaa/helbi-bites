"use client"

import { useId } from "react"

export function BrandHeader() {
  const maskId = useId()

  return (
    <div className="flex flex-col items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-500">
      <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden className="text-primary">
        <mask id={maskId}>
          <rect width="32" height="32" rx="9" fill="white" />
          <circle cx="25" cy="7" r="6.5" fill="black" />
        </mask>
        <rect width="32" height="32" rx="9" fill="currentColor" mask={`url(#${maskId})`} />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Helbi Bites
      </span>
    </div>
  )
}
