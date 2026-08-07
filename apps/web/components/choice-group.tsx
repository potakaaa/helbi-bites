"use client"

import { cn } from "@workspace/ui/lib/utils"

type Option<T extends string> = {
  value: T
  label: string
}

type ChoiceGroupProps<T extends string> = {
  legend: string
  options: readonly Option<T>[]
  value: T | null
  onChange: (value: T) => void
}

export function ChoiceGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-0.5 text-[13px] font-medium text-muted-foreground">{legend}</legend>
      <div className="flex gap-1 rounded-xl border border-border bg-muted/60 p-1">
        {options.map((option) => {
          const selected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center rounded-lg px-1.5 text-center text-[13px] leading-tight font-medium transition-all duration-200 active:scale-[0.97]",
                selected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-foreground/65 hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
