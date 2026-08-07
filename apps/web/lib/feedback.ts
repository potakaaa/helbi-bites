export const TEXTURE_OPTIONS = [
  { value: "too_soft", label: "Too soft" },
  { value: "just_right", label: "Just right" },
  { value: "too_firm", label: "Too firm" },
] as const

export const SWEETNESS_OPTIONS = [
  { value: "not_sweet_enough", label: "Not sweet enough" },
  { value: "just_right", label: "Just right" },
  { value: "too_sweet", label: "Too sweet" },
] as const

export const CHOCOLATE_OPTIONS = [
  { value: "too_light", label: "Too light" },
  { value: "just_right", label: "Just right" },
  { value: "too_rich", label: "Too rich" },
] as const

export const PORTION_OPTIONS = [
  { value: "too_small", label: "Too small" },
  { value: "just_right", label: "Just right" },
  { value: "too_much", label: "Too much" },
] as const

export const BUY_AGAIN_OPTIONS = [
  { value: "definitely", label: "Definitely" },
  { value: "maybe", label: "Maybe" },
  { value: "probably_not", label: "Probably not" },
] as const

export type ChoiceValue<T extends readonly { value: string }[]> = T[number]["value"]

export type FeedbackPayload = {
  batch: string | null
  rating: number
  texture: ChoiceValue<typeof TEXTURE_OPTIONS> | null
  sweetness: ChoiceValue<typeof SWEETNESS_OPTIONS> | null
  chocolateFlavor: ChoiceValue<typeof CHOCOLATE_OPTIONS> | null
  portionSize: ChoiceValue<typeof PORTION_OPTIONS> | null
  buyAgain: ChoiceValue<typeof BUY_AGAIN_OPTIONS> | null
  comment: string
}

export type SubscribePayload = {
  email: string
  marketingConsent: boolean
  batch: string | null
}
