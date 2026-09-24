"use client"

import { SearchInput } from "@/components/shared/SearchInput"

interface SensorSearchBoxProps {
  initialValue: string
  onSearch: (value: string) => void
  delayMs?: number
}

export function SensorSearchBox({
  initialValue,
  onSearch,
  delayMs,
}: SensorSearchBoxProps) {
  return (
    <SearchInput
      initialValue={initialValue}
      onSearch={onSearch}
      delayMs={delayMs}
      ariaLabel="Szukaj czujnika"
      placeholder="Krowa, nr kolczyka lub DevEUI"
      className="flex-1 md:max-w-sm"
    />
  )
}
