"use client"

import * as React from "react"
import { ChevronRight, Info } from "lucide-react"

import { FormAlert, ZButton, ZField, ZInput } from "@/components/auth/auth-ui"
import { ZagrodaMark } from "@/components/brand/zagroda-logo"
import { AsideCard, SetupShell, StepTitle } from "@/components/setup/setup-shell"
import { ZOptionChips, ZSegmented, ZSelect } from "@/components/setup/setup-ui"
import { userService } from "@/lib/api/user-service"
import { requestErrorMessage } from "@/lib/auth/auth-errors"
import {
  farmLocation,
  formatHerdNumber,
  herdSizes,
  isCompleteHerdNumber,
  productionTypes,
  voivodeships,
} from "@/lib/setup/farm-form"
import {
  saveFarmProfile,
  type FarmProfile,
  type HerdSize,
  type ProductionType,
} from "@/lib/setup/setup-state"
import type { Farm } from "@/types/farm"

type FieldErrors = { name?: string; city?: string; region?: string; herdNumber?: string }

const regionOptions = voivodeships.map((v) => ({ value: v, label: v }))

/** W6 krok 1 — dane gospodarstwa. Zapis: POST /farms, potem aktywne gospodarstwo (PATCH /users/me). */
export function FarmStep({ onCreated }: { onCreated: (farm: Farm, profile: FarmProfile) => void }) {
  const [name, setName] = React.useState("")
  const [herdNumber, setHerdNumber] = React.useState("")
  const [city, setCity] = React.useState("")
  const [region, setRegion] = React.useState("")
  const [productionType, setProductionType] = React.useState<ProductionType>("dairy")
  const [herdSize, setHerdSize] = React.useState<HerdSize | null>(null)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [saving, setSaving] = React.useState(false)

  const clear = (field: keyof FieldErrors) =>
    setErrors((c) => (c[field] ? { ...c, [field]: undefined } : c))

  async function submit(e?: React.FormEvent) {
    e?.preventDefault()
    const next: FieldErrors = {
      name: name.trim().length < 2 ? "Wpisz nazwę gospodarstwa." : undefined,
      city: city.trim().length < 2 ? "Wpisz miejscowość." : undefined,
      region: region ? undefined : "Wybierz województwo.",
      herdNumber:
        herdNumber && !isCompleteHerdNumber(herdNumber)
          ? "Numer siedziby stada ma 12 cyfr, np. 012345678-001."
          : undefined,
    }
    setErrors(next)
    setFormError(null)
    if (Object.values(next).some(Boolean)) return

    setSaving(true)
    try {
      const { data: farm } = await userService.createFarm({
        name: name.trim(),
        location: farmLocation(city, region),
        type: "cattle",
      })
      // /animals działa na gospodarstwie zapisanym jako aktywne — tak samo jak w mobile.
      await userService.setActiveFarm(farm.id)
      const profile: FarmProfile = {
        city: city.trim(),
        region,
        productionType,
        herdSize: herdSize ?? "30to80",
        herdNumber: herdNumber ? `PL${herdNumber}` : undefined,
      }
      saveFarmProfile(farm.id, profile)
      onCreated(farm, profile)
    } catch (error) {
      setFormError(requestErrorMessage(error))
      setSaving(false)
    }
  }

  const typeLabel = productionTypes.find((t) => t.value === productionType)?.label.toLowerCase()
  const sizeLabel = herdSizes.find((s) => s.value === (herdSize ?? "30to80"))?.label

  return (
    <SetupShell
      step="farm"
      aside={
        <AsideCard>
          <span className="text-sm text-[#9AA597]">Tak gospodarstwo zobaczysz w nagłówku aplikacji:</span>
          <span aria-hidden className="flex items-center gap-3 rounded-2xl bg-[#17241B] p-3">
            <ZagrodaMark size={40} labelled={false} />
            <span className="flex min-w-0 flex-col">
              <b className="truncate text-base font-semibold">{name.trim() || "Twoje gospodarstwo"}</b>
              <span className="truncate text-[13px] text-[#9AA597]">
                {[city.trim(), region].filter(Boolean).join(", ") || "Miejscowość, województwo"} ·{" "}
                {typeLabel} · {sizeLabel} krów
              </span>
            </span>
          </span>
          <p className="flex items-start gap-2.5 text-sm leading-5 text-[#C9D0C6]">
            <Info className="mt-0.5 size-4 flex-none text-[#8FCB98]" aria-hidden />
            <span>
              Numer siedziby stada znajdziesz w IRZplus. Przyda się do zgłoszeń, ale możesz go dodać
              później.
            </span>
          </p>
        </AsideCard>
      }
      footer={
        <>
          <span className="flex-1" />
          <ZButton
            type="submit"
            form="setup-farm"
            size="lg"
            loading={saving}
            className="min-w-[220px]"
          >
            Dalej: stado
            <ChevronRight className="size-[22px]" aria-hidden />
          </ZButton>
        </>
      }
    >
      <StepTitle
        title="Twoje gospodarstwo"
        subtitle="Te dane zobaczysz w nagłówku aplikacji i w raportach."
      />
      <form id="setup-farm" noValidate onSubmit={submit} className="flex flex-col gap-4">
        <ZField label="Nazwa gospodarstwa *" htmlFor="farm-name" error={errors.name}>
          <ZInput
            id="farm-name"
            value={name}
            placeholder="np. Gospodarstwo Kowalski"
            autoComplete="organization"
            invalid={!!errors.name}
            onChange={(e) => {
              setName(e.target.value)
              clear("name")
            }}
          />
        </ZField>
        <ZField
          label="Numer siedziby stada"
          hint="opcjonalnie"
          htmlFor="farm-herd-number"
          error={errors.herdNumber}
          below={<span className="text-xs text-z-ink-3">Znajdziesz go w IRZplus. Przyda się do zgłoszeń.</span>}
        >
          <ZInput
            id="farm-herd-number"
            icon={<span className="font-mono font-semibold text-z-ink-2">PL</span>}
            value={herdNumber}
            placeholder="000000000-000"
            inputMode="numeric"
            invalid={!!errors.herdNumber}
            style={{ fontFamily: "var(--font-mono)" }}
            onChange={(e) => {
              setHerdNumber(formatHerdNumber(e.target.value))
              clear("herdNumber")
            }}
          />
        </ZField>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ZField label="Miejscowość *" htmlFor="farm-city" error={errors.city}>
            <ZInput
              id="farm-city"
              value={city}
              autoComplete="address-level2"
              invalid={!!errors.city}
              onChange={(e) => {
                setCity(e.target.value)
                clear("city")
              }}
            />
          </ZField>
          <ZField label="Województwo *" htmlFor="farm-region" error={errors.region}>
            <ZSelect
              id="farm-region"
              value={region}
              placeholder="Wybierz"
              options={regionOptions}
              invalid={!!errors.region}
              onChange={(v) => {
                setRegion(v)
                clear("region")
              }}
            />
          </ZField>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <span id="farm-type-label" className="text-sm leading-[18px] font-semibold text-z-ink-2">
              Typ hodowli
            </span>
            <ZSegmented
              labelledBy="farm-type-label"
              options={productionTypes}
              value={productionType}
              onChange={setProductionType}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span id="farm-size-label" className="text-sm leading-[18px] font-semibold text-z-ink-2">
              Ile masz krów?
            </span>
            <ZOptionChips
              labelledBy="farm-size-label"
              options={herdSizes}
              value={herdSize}
              onChange={setHerdSize}
            />
          </div>
        </div>
        {formError ? <FormAlert message={formError} /> : null}
      </form>
    </SetupShell>
  )
}
