"use client"

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Plus, Radio, SearchX } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { ActivateSensorDialog } from "@/components/sensors/ActivateSensorDialog"
import { SensorPagination } from "@/components/sensors/SensorPagination"
import { SensorSearchBox } from "@/components/sensors/SensorSearchBox"
import { SensorSummaryTiles } from "@/components/sensors/SensorSummaryTiles"
import { SensorTable } from "@/components/sensors/SensorTable"
import {
  ASSIGNMENT_OPTIONS,
  DEFAULT_SENSOR_LIST_STATE,
  HEALTH_OPTIONS,
  SORT_OPTIONS,
  applyTile,
  hasActiveFilters,
  isTileActive,
  parseSensorListState,
  toApiParams,
  toSearchParams,
  type SensorListState,
} from "@/components/sensors/sensor-list-query"
import { formatDevEui } from "@/components/sensors/sensor-utils"
import { getFarmSensors } from "@/api/sensors"
import { cn } from "@/lib/utils"
import type { SensorPage } from "@/lib/types/sensor.types"

/** Radix Select nie przyjmuje pustej wartości — „bez filtra" ma własny znacznik. */
const ANY = "__any__"

export default function CzujnikiPage() {
  // useSearchParams wymaga granicy Suspense przy renderowaniu po stronie serwera.
  return (
    <Suspense fallback={null}>
      <SensorsView />
    </Suspense>
  )
}

/**
 * Pula czujników gospodarstwa: wyszukiwanie, filtry, sortowanie i paginacja po stronie
 * serwera; stan listy żyje w adresie strony. Kafelki nad tabelą pokazują całą pulę
 * i działają jak szybkie filtry.
 */
function SensorsView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()
  const state = useMemo(
    () => parseSensorListState(new URLSearchParams(queryString)),
    [queryString]
  )

  const [data, setData] = useState<SensorPage | null>(null)
  const [loadedKey, setLoadedKey] = useState<string | null>(null)
  const [error, setError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [searchResetKey, setSearchResetKey] = useState(0)
  const [activateOpen, setActivateOpen] = useState(false)

  const update = useCallback(
    (next: SensorListState) => {
      const qs = toSearchParams(next).toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router]
  )

  // Pobieranie zależy tylko od stanu listy — nie od tożsamości routera, która może się zmieniać.
  const updateRef = useRef(update)
  useEffect(() => {
    updateRef.current = update
  }, [update])

  const requestKey = `${toSearchParams(state).toString()}#${reloadToken}`
  // Poprzednie wyniki zostają na ekranie, dopóki nie przyjdą nowe — bez migania przy pisaniu.
  const isFetching = loadedKey !== requestKey

  useEffect(() => {
    let cancelled = false
    getFarmSensors(toApiParams(state)).then(
      (page) => {
        if (cancelled) return
        setData(page)
        setError(false)
        setLoadedKey(requestKey)
        // Backend oddaje ostatnią istniejącą stronę, gdy prosiliśmy o dalszą — wyrównujemy adres.
        if (page.number !== state.page) updateRef.current({ ...state, page: page.number })
      },
      (err) => {
        if (cancelled) return
        console.error("Błąd ładowania czujników:", err)
        setError(true)
        setLoadedKey(requestKey)
      }
    )
    return () => {
      cancelled = true
    }
  }, [requestKey, state])

  const onSearch = useCallback(
    (search: string) => update({ ...state, search, page: 0 }),
    [state, update]
  )

  const clearFilters = () => {
    setSearchResetKey((k) => k + 1)
    update({ ...DEFAULT_SENSOR_LIST_STATE, sort: state.sort, size: state.size })
  }

  const filtered = hasActiveFilters(state)
  const poolIsEmpty = data?.summary.total === 0

  return (
    <div className="flex flex-1 flex-col gap-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Czujniki</h1>
          <p className="text-xs text-muted-foreground">
            Czujniki aktywowane w Twoim gospodarstwie i ich przypisanie do krów
          </p>
        </div>
        <Button className="gap-2" onClick={() => setActivateOpen(true)}>
          <Plus className="h-4 w-4" />
          Aktywuj czujnik
        </Button>
      </div>

      {error && !data ? (
        <ApiErrorState
          message="Nie udało się pobrać listy czujników."
          onRetry={() => setReloadToken((t) => t + 1)}
        />
      ) : (
        <>
          <SensorSummaryTiles
            summary={data?.summary ?? null}
            isActive={(tile) => isTileActive(state, tile)}
            onSelect={(tile) => update(applyTile(state, tile))}
          />

          {poolIsEmpty ? (
            <Card className="shadow-none" size="sm">
              <EmptyPool onActivate={() => setActivateOpen(true)} />
            </Card>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <SensorSearchBox
                  key={searchResetKey}
                  initialValue={state.search}
                  onSearch={onSearch}
                />
                <FilterSelect
                  label="Przypisanie"
                  allLabel="Wszystkie czujniki"
                  value={state.assignment}
                  options={ASSIGNMENT_OPTIONS}
                  onChange={(assignment) => update({ ...state, assignment, page: 0 })}
                />
                <FilterSelect
                  label="Stan"
                  allLabel="Każdy stan"
                  value={state.health}
                  options={HEALTH_OPTIONS}
                  onChange={(health) => update({ ...state, health, page: 0 })}
                />
                <Select
                  value={state.sort}
                  onValueChange={(sort) =>
                    update({ ...state, sort: sort as SensorListState["sort"], page: 0 })
                  }
                >
                  <SelectTrigger className="h-9 w-full text-xs sm:w-[220px]" aria-label="Sortowanie">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="text-xs">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filtered && (
                  <Button variant="ghost" size="sm" className="h-9 text-xs" onClick={clearFilters}>
                    Wyczyść filtry
                  </Button>
                )}
              </div>

              {error && data && (
                <p
                  role="alert"
                  className="flex flex-wrap items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400"
                >
                  Nie udało się odświeżyć listy — widzisz poprzednie wyniki.
                  <button
                    type="button"
                    className="font-semibold underline underline-offset-2"
                    onClick={() => setReloadToken((t) => t + 1)}
                  >
                    Spróbuj ponownie
                  </button>
                </p>
              )}

              <Card
                className="gap-0 overflow-hidden p-0 py-0 shadow-none data-[size=sm]:py-0"
                size="sm"
                aria-busy={isFetching}
              >
                {!data ? (
                  <div className="flex flex-col gap-3 p-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full" />
                    ))}
                  </div>
                ) : data.content.length === 0 ? (
                  <NoMatches onClear={clearFilters} />
                ) : (
                  <div className={cn("transition-opacity", isFetching && "opacity-60")}>
                    <SensorTable sensors={data.content} />
                  </div>
                )}
                {data && data.totalElements > 0 && (
                  <SensorPagination
                    page={data.number}
                    size={data.size}
                    totalElements={data.totalElements}
                    totalPages={data.totalPages}
                    disabled={isFetching}
                    onPageChange={(page) => update({ ...state, page })}
                    onSizeChange={(size) => update({ ...state, size, page: 0 })}
                  />
                )}
              </Card>
            </>
          )}
        </>
      )}

      <ActivateSensorDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        onActivated={(sensor) => {
          // Nowy czujnik może nie pasować do bieżących filtrów — odświeżamy listę i kafelki z serwera.
          setReloadToken((t) => t + 1)
          if (filtered) {
            toast.info(`Czujnik ${formatDevEui(sensor.devEui)} dodany — wyczyść filtry, jeśli go nie widzisz.`)
          }
        }}
      />
    </div>
  )
}

function FilterSelect<T extends string>({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string
  allLabel: string
  value: T | null
  options: { value: T; label: string }[]
  onChange: (value: T | null) => void
}) {
  return (
    <Select
      value={value ?? ANY}
      onValueChange={(next) => onChange(next === ANY ? null : (next as T))}
    >
      <SelectTrigger
        className={cn("h-9 w-full text-xs sm:w-[170px]", value && "border-foreground/60")}
        aria-label={label}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ANY} className="text-xs">
          {allLabel}
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-xs">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <SearchX className="h-6 w-6 text-muted-foreground" />
      <div className="space-y-1">
        <p className="text-sm font-medium">Brak czujników pasujących do filtrów</p>
        <p className="text-xs text-muted-foreground">
          Sprawdź pisownię albo poszerz wyszukiwanie.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Wyczyść filtry
      </Button>
    </div>
  )
}

function EmptyPool({ onActivate }: { onActivate: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Radio className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">Nie masz jeszcze aktywnych czujników</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Aktywuj zakupiony czujnik danymi z etykiety. Potem przypiszesz go do krowy
          przy jej dodawaniu albo w profilu krowy.
        </p>
      </div>
      <Button variant="outline" size="sm" className="gap-2" onClick={onActivate}>
        <Plus className="h-4 w-4" />
        Aktywuj czujnik
      </Button>
    </div>
  )
}
