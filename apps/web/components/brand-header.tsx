"use client"

import Image from "next/image"

export function BrandHeader() {
  return (
    <div className="flex flex-col items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-500">
      <Image
        src="/assets/logo.png"
        alt="lil' bites"
        width={72}
        height={72}
        className="size-18"
        priority
      />
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          lil&apos; bites
        </span>
        <span className="text-[12px] text-muted-foreground">bite more, worry less</span>
      </div>
    </div>
  )
}
