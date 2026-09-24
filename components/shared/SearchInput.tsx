"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchInputProps {
  initialValue: string
  onSearch: (value: string) => void
  placeholder: string
  ariaLabel: string
  delayMs?: number
  className?: string
  inputClassName?: string
}

/**
 * Wyszukiwarka z opóźnieniem — zapytanie leci, gdy hodowca przestanie pisać, a nie po każdej
 * literze; Enter szuka od razu. Rodzic resetuje pole zmianą `key`.
 */
export function SearchInput({
  initialValue,
  onSearch,
  placeholder,
  ariaLabel,
  delayMs = 400,
  className,
  inputClassName,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    if (value.trim() === initialValue.trim()) return
    const timer = setTimeout(() => onSearch(value.trim()), delayMs)
    return () => clearTimeout(timer)
  }, [value, initialValue, onSearch, delayMs])

  return (
    <div className={cn("relative min-w-0", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        aria-label={ariaLabel}
        placeholder={placeholder}
        className={cn(
          "pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden",
          inputClassName
        )}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
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
