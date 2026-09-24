"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { SectionCard } from "@/components/shared/SectionCard"
import {
  useHerdAgenda,
  useHerdAnimals,
  useHerdKpi,
  useHerdTasks,
} from "@/hooks/use-herd"
import { formatWeekdayLong } from "@/lib/stado/dates"
import {
  parseHerdListState,
  toHerdSearchParams,
  type HerdListState,
} from "@/lib/stado/herd-list-query"
import { animalsCountLabel, herdStatsLine } from "@/lib/stado/presenters"
import type { Animal } from "@/lib/types/stado.types"
import { HerdAgenda } from "./agenda/HerdAgenda"
import { AddEventDialog, type EventTarget } from "./events/AddEventDialog"
import { HerdHeader } from "./list/HerdHeader"
import { HerdPagination } from "./list/HerdPagination"
import { HerdTable } from "./list/HerdTable"
import { HerdTaskBar } from "./list/HerdTaskBar"
import { HerdToolbar } from "./list/HerdToolbar"

const AGENDA_DAYS = 14
const COW_PROFILE_BASE = "/dashboard/stado"

/**
 * Ekran Stada: pasek zadań, lista zwierząt z filtrami (stan w adresie strony)
 * i agenda na dwa tygodnie. Dane pobierają hooki z hooks/use-herd.
 */
export default function StadoView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { activeFarm } = useUser()
  const farmId = activeFarm?.id

  const queryString = searchParams.toString()
  const state = useMemo(
    () => parseHerdListState(new URLSearchParams(queryString)),
    [queryString]
  )
  const [now] = useState(() => new Date())
  const [eventTarget, setEventTarget] = useState<EventTarget | null>(null)

  const animals = useHerdAnimals(state, farmId)
  const tasks = useHerdTasks(farmId)
  const agenda = useHerdAgenda(farmId, AGENDA_DAYS)
  const kpi = useHerdKpi(farmId)

  const update = useCallback(
    (patch: Partial<HerdListState>) => {
      // Każda zmiana filtra wraca na pierwszą stronę, chyba że zmieniamy właśnie stronę.
      const next = { ...state, page: 0, ...patch }
      const qs = toHerdSearchParams(next).toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, state]
  )

  // Backend przycina stronę spoza zakresu — wyrównujemy adres, żeby paginacja się zgadzała.
  const updateRef = useRef(update)
  useEffect(() => {
    updateRef.current = update
  }, [update])
  const loadedPage = animals.data?.number
  useEffect(() => {
    if (
      loadedPage !== undefined &&
      !animals.isLoading &&
      loadedPage !== state.page
    ) {
      updateRef.current({ page: loadedPage })
    }
  }, [loadedPage, animals.isLoading, state.page])

  const reloadHerd = () => {
    animals.reload()
    tasks.reload()
    agenda.reload()
    kpi.reload()
  }

  const openAnimal = (animalId: string) =>
    router.push(`${COW_PROFILE_BASE}/${animalId}`)
  const onSearch = useCallback((search: string) => update({ search }), [update])

  const page = animals.data

  return (
    <div className="flex w-full flex-col gap-5 px-4 pt-5 pb-10 md:px-6">
      <HerdHeader
        total={tasks.data?.total ?? null}
        farmName={activeFarm?.name ?? null}
        search={state.search}
        onSearch={onSearch}
        onAnimalAdded={reloadHerd}
      />

      <HerdTaskBar
        tasks={tasks.data}
        activeTask={state.task}
        onTaskChange={(task) => update({ task })}
        dateLabel={formatWeekdayLong(now)}
        statsLine={kpi.data ? herdStatsLine(kpi.data) : null}
        error={tasks.error}
        onRetry={tasks.reload}
      />

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_clamp(260px,24%,360px)]">
        {animals.error && !page ? (
          <ApiErrorState
            message="Nie udało się pobrać listy zwierząt."
            onRetry={animals.reload}
          />
        ) : (
          <SectionCard aria-busy={animals.isLoading}>
            <HerdToolbar
              category={state.category}
              onCategoryChange={(category) => update({ category })}
              lactation={state.lactation}
              onLactationChange={(lactation) => update({ lactation })}
              sort={state.sort}
              onSortChange={(sort) => update({ sort })}
              resultLabel={page ? animalsCountLabel(page.totalElements) : null}
            />
            <HerdTable
              animals={page?.content ?? null}
              now={now}
              onOpen={(animal: Animal) => openAnimal(animal.id)}
              onQuickAdd={(animal: Animal) => setEventTarget(animal)}
            />
            {page && (
              <HerdPagination
                page={page.number}
                totalPages={page.totalPages}
                totalElements={page.totalElements}
                disabled={animals.isLoading}
                onPageChange={(next) => update({ page: next })}
              />
            )}
          </SectionCard>
        )}

        <HerdAgenda
          items={agenda.data}
          days={AGENDA_DAYS}
          now={now}
          error={agenda.error}
          onRetry={agenda.reload}
          onOpenAnimal={openAnimal}
        />
      </div>

      <AddEventDialog
        animal={eventTarget}
        onClose={() => setEventTarget(null)}
        onSaved={reloadHerd}
      />
    </div>
  )
}
