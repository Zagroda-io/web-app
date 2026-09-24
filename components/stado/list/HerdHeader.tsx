"use client"

import { SearchInput } from "@/components/shared/SearchInput"
import { AddCowSheet } from "@/components/stado/new-animal/AddCowSheet"

interface HerdHeaderProps {
  total: number | null
  farmName: string | null
  search: string
  onSearch: (value: string) => void
  onAnimalAdded: () => void
  /** Zmiana klucza czyści pole wyszukiwania. */
  searchResetKey?: number
}

export function HerdHeader({
  total,
  farmName,
  search,
  onSearch,
  onAnimalAdded,
  searchResetKey,
}: HerdHeaderProps) {
  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <div className="mr-auto flex items-baseline gap-2.5">
        <h1 className="text-[22px] font-semibold tracking-[-0.3px]">Stado</h1>
        <span className="text-sm text-muted-foreground">
          {total ?? "—"} szt.{farmName && ` · ${farmName}`}
        </span>
      </div>
      <SearchInput
        key={searchResetKey}
        initialValue={search}
        onSearch={onSearch}
        ariaLabel="Szukaj zwierzęcia"
        placeholder="Szukaj — numer, imię, kolczyk…"
        className="max-w-[460px] min-w-[200px] flex-[1_1_260px]"
        inputClassName="h-10 rounded-[10px] bg-card md:text-sm"
      />
      <AddCowSheet
        onAdded={onAnimalAdded}
        triggerClassName="h-10 rounded-[10px] px-4 font-semibold"
      />
    </header>
  )
}
