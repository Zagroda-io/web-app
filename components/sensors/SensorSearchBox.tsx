"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SensorSearchBoxProps {
  initialValue: string
  onSearch: (value: string) => void
  delayMs?: number
}

/**
 * Wyszukiwarka z opóźnieniem — zapytanie leci, gdy hodowca przestanie pisać, a nie po każdej
 * literze. Rodzic resetuje pole zmianą `key` (np. po „Wyczyść filtry").
 */
export function SensorSearchBox({ initialValue, onSearch, delayMs = 400 }: SensorSearchBoxProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (value.trim() === initialValue.trim()) return
    const timer = setTimeout(() => onSearch(value.trim()), delayMs)
    return () => clearTimeout(timer)
  }, [value, initialValue, onSearch, delayMs])

  return (
    <div className="relative min-w-0 flex-1 md:max-w-sm">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label="Szukaj czujnika"
        placeholder="Krowa, nr kolczyka lub DevEUI"
        className="pr-8 pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // Enter szuka od razu, bez czekania na opóźnienie.
          if (e.key === "Enter") onSearch(value.trim())
        }}
      />
      {value && (
        <button
          type="button"
          aria-label="Wyczyść wyszukiwanie"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
          onClick={() => {
            setValue("")
            onSearch("")
          }}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
