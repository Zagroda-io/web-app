"use client"

import * as React from "react"
import { CheckCircle2, ChevronRight, FileUp, Info, Plus, Tag } from "lucide-react"

import { FormAlert, ZButton, ZField, ZInput } from "@/components/auth/auth-ui"
import { AsideCard, SetupShell, StepTitle } from "@/components/setup/setup-shell"
import { EarTag, IconBox, ListRow, Micro, ZChip, ZSelect } from "@/components/setup/setup-ui"
import { addCow, getAnimals } from "@/lib/api/stado"
import { requestErrorMessage } from "@/lib/auth/auth-errors"
import { breeds, EAR_TAG_DIGITS, formatIsoDate, normalizeEarTag } from "@/lib/setup/farm-form"
import type { Animal } from "@/lib/types/stado.types"

type FieldErrors = { tag?: string; birthDate?: string }

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

/** W6 krok 2 — pierwsze krowy. Każda zapisuje się od razu w core-api (POST /animals), jak w mobile. */
export function HerdStep({
  farmId,
  onNext,
  onSkip,
}: {
  farmId: string
  onNext: () => void
  onSkip: () => void
}) {
  const [animals, setAnimals] = React.useState<Animal[] | null>(null)
  const [total, setTotal] = React.useState(0)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const [tag, setTag] = React.useState("")
  const [name, setName] = React.useState("")
  const [birthDate, setBirthDate] = React.useState("")
  const [breed, setBreed] = React.useState("HO")
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)
  const [added, setAdded] = React.useState<string | null>(null)
  const tagRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    let cancelled = false
    getAnimals({ farmId, page: 0, size: 50 })
      .then((page) => {
        if (cancelled) return
        setAnimals(page.content)
        setTotal(page.totalElements)
      })
      .catch((e: unknown) => !cancelled && setLoadError(requestErrorMessage(e)))
    return () => {
      cancelled = true
    }
  }, [farmId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: FieldErrors = {
      tag: tag.length === EAR_TAG_DIGITS ? undefined : `Numer kolczyka ma ${EAR_TAG_DIGITS} cyfr po „PL”.`,
      birthDate: !birthDate
        ? "Wpisz datę urodzenia."
        : birthDate > todayIso()
          ? "Data urodzenia nie może być w przyszłości."
          : undefined,
    }
    setErrors(next)
    setFormError(null)
    setAdded(null)
    if (Object.values(next).some(Boolean)) return

    setSaving(true)
    try {
      const cow = await addCow({
        earTagNumber: `PL${tag}`,
        name: name.trim() || undefined,
        birthDate,
        breed,
        sex: "FEMALE",
      })
      setAnimals((list) => [cow, ...(list ?? [])])
      setTotal((n) => n + 1)
      setAdded(cow.name || cow.earTagNumber)
      setTag("")
      setName("")
      setBirthDate("")
      tagRef.current?.focus()
    } catch (error) {
      setFormError(requestErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  return (
    <SetupShell
      step="herd"
      aside={
        <AsideCard>
          <span className="flex items-center gap-3.5">
            <EarTag number="PL005123403412" size="lg" />
            <span className="text-sm leading-5 text-[#C9D0C6]">
              Krowę rozpoznajemy po numerze kolczyka. Ten sam numer łączy ją potem z obrożą i obrazem
              z kamery.
            </span>
          </span>
          <p className="flex items-start gap-2.5 text-sm leading-5 text-[#C9D0C6]">
            <Info className="mt-0.5 size-4 flex-none text-[#8FCB98]" aria-hidden />
            <span>
              Na start wystarczy kolczyk, data urodzenia i rasa. Imię i resztę uzupełnisz później w
              zakładce Stado.
            </span>
          </p>
        </AsideCard>
      }
      footer={
        <>
          <span className="flex-1" />
          <ZButton type="button" variant="ghost" className="text-[15px]" onClick={onSkip}>
            Pomiń, dodam później
          </ZButton>
          <ZButton type="button" size="lg" className="min-w-[220px]" disabled={total === 0} onClick={onNext}>
            Dalej: powiadomienia
            <ChevronRight className="size-[22px]" aria-hidden />
          </ZButton>
        </>
      }
    >
      <StepTitle
        title="Dodaj pierwsze krowy"
        subtitle="Wystarczy kilka na start. Resztę dodasz w dowolnej chwili."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <section
          aria-labelledby="imp-h"
          className="flex flex-col gap-4 rounded-[20px] border border-z-line bg-z-surface p-5"
        >
          <span className="flex items-center gap-3">
            <IconBox className="bg-z-green-50 text-z-accent">
              <FileUp className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <h2 id="imp-h" className="text-[17px] leading-6 font-semibold">
                Zaimportuj plik
              </h2>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">CSV lub Excel z programu do stada</span>
            </span>
          </span>
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-z-line-strong px-4 py-6 text-center">
            <ZChip>wkrótce</ZChip>
            <span className="text-[13.5px] leading-[19px] text-z-ink-2">
              Import z pliku uruchomimy w kolejnej wersji. Na razie dodaj krowy ręcznie.
            </span>
          </div>
        </section>

        <section
          aria-labelledby="man-h"
          className="@container flex flex-col gap-3 rounded-[20px] border border-z-line bg-z-surface p-5"
        >
          <span className="flex items-center gap-3">
            <IconBox className="bg-z-tag text-[#151915]">
              <Tag className="size-[22px]" aria-hidden />
            </IconBox>
            <span className="flex min-w-0 flex-1 flex-col">
              <h2 id="man-h" className="text-[17px] leading-6 font-semibold">
                Dodaj ręcznie
              </h2>
              <span className="text-[13.5px] leading-[19px] text-z-ink-3">Kolczyk, data urodzenia, rasa</span>
            </span>
          </span>
          <form noValidate onSubmit={submit} className="flex flex-col gap-3">
            <ZField label="Numer kolczyka" htmlFor="cow-tag" error={errors.tag}>
              <ZInput
                ref={tagRef}
                id="cow-tag"
                icon={<span className="font-mono font-semibold text-z-ink-2">PL</span>}
                value={tag}
                inputMode="numeric"
                placeholder="000000000000"
                invalid={!!errors.tag}
                style={{ fontFamily: "var(--font-mono)" }}
                onChange={(e) => {
                  setTag(normalizeEarTag(e.target.value))
                  setErrors((c) => ({ ...c, tag: undefined }))
                }}
              />
            </ZField>
            {/* Data z ikoną kalendarza potrzebuje ~160 px — w wąskiej karcie pola idą pod sobą. */}
            <div className="grid grid-cols-1 gap-2.5 @[380px]:grid-cols-2">
              <ZField label="Imię" hint="opcj." htmlFor="cow-name">
                <ZInput id="cow-name" value={name} onChange={(e) => setName(e.target.value)} />
              </ZField>
              <ZField label="Urodzona" htmlFor="cow-birth" error={errors.birthDate}>
                <ZInput
                  id="cow-birth"
                  type="date"
                  max={todayIso()}
                  value={birthDate}
                  invalid={!!errors.birthDate}
                  onChange={(e) => {
                    setBirthDate(e.target.value)
                    setErrors((c) => ({ ...c, birthDate: undefined }))
                  }}
                />
              </ZField>
            </div>
            <ZField label="Rasa" htmlFor="cow-breed">
              <ZSelect id="cow-breed" value={breed} options={breeds} onChange={setBreed} />
            </ZField>
            {formError ? <FormAlert message={formError} /> : null}
            {added ? (
              <p role="status" className="flex items-center gap-2 text-[13.5px] font-semibold text-z-accent">
                <CheckCircle2 className="size-4" aria-hidden />
                Dodano: {added}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-z-bg-sunken text-base font-semibold text-z-ink outline-none hover:bg-z-line focus-visible:ring-[3px] focus-visible:ring-z-ink/25 disabled:opacity-45"
            >
              <Plus className="size-[18px]" aria-hidden />
              {saving ? "Dodawanie…" : "Dodaj krowę"}
            </button>
          </form>
        </section>
      </div>

      {loadError ? (
        <FormAlert message={loadError} />
      ) : animals && animals.length > 0 ? (
        <section aria-labelledby="added-h" className="flex flex-col gap-2.5">
          <Micro id="added-h">Dodane · {total}</Micro>
          <ul className="overflow-hidden rounded-[20px] border border-z-line bg-z-surface">
            {animals.map((a, i) => (
              <ListRow key={a.id} first={i === 0}>
                <EarTag number={a.earTagNumber} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <b className="truncate font-semibold">{a.name || a.earTagNumber}</b>
                  <span className="truncate text-[13.5px] leading-[19px] text-z-ink-3">
                    Krowa · {a.breed} · ur. {formatIsoDate(a.birthDate)}
                    {a.name ? <span className="font-mono"> · {a.earTagNumber}</span> : null}
                  </span>
                </span>
              </ListRow>
            ))}
          </ul>
        </section>
      ) : null}
    </SetupShell>
  )
}
