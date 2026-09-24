"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SegmentedControl } from "@/components/shared/SegmentedControl"
import { addAnimalEvent } from "@/lib/api/stado"
import { apiErrorMessage } from "@/lib/api-error"
import {
  BCS_MAX,
  BCS_MIN,
  buildEventRequest,
  emptyEventForm,
  validateEventForm,
  type EventFormState,
  type PregnancyResult,
} from "@/lib/stado/event-form"
import { EVENT_TYPE_META, MANUAL_EVENT_TYPES } from "@/lib/stado/labels"
import { animalDisplayName } from "@/lib/stado/presenters"
import { cn } from "@/lib/utils"
import type { AnimalEventType } from "@/lib/types/stado.types"

export interface EventTarget {
  id: string
  name: string | null
  earTagNumber: string | null
}

interface AddEventDialogProps {
  /** Zwierzę, którego dotyczy zdarzenie; `null` zamyka dialog. */
  animal: EventTarget | null
  initialType?: AnimalEventType
  onClose: () => void
  onSaved?: () => void
}

const PREGNANCY_RESULTS: { value: PregnancyResult; label: string }[] = [
  { value: "POSITIVE", label: "Cielna" },
  { value: "NEGATIVE", label: "Pusta" },
]

/**
 * Szybkie dodanie zdarzenia — z listy stada (przycisk „+") i z karty krowy.
 * Formularz jest montowany od nowa dla każdego otwarcia, więc zawsze startuje czysty.
 */
export function AddEventDialog({
  animal,
  initialType = "INSEMINATION",
  onClose,
  onSaved,
}: AddEventDialogProps) {
  return (
    <Dialog open={animal !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="gap-3.5 sm:max-w-[440px]">
        {animal && (
          <EventForm
            key={`${animal.id}-${initialType}`}
            animal={animal}
            initialType={initialType}
            onClose={onClose}
            onSaved={onSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

function EventForm({
  animal,
  initialType,
  onClose,
  onSaved,
}: Required<Pick<AddEventDialogProps, "initialType" | "onClose">> & {
  animal: EventTarget
  onSaved?: () => void
}) {
  const [now] = useState(() => new Date())
  const [form, setForm] = useState<EventFormState>(() =>
    emptyEventForm(initialType, now)
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showErrors, setShowErrors] = useState(false)

  const update = (patch: Partial<EventFormState>) =>
    setForm((prev) => ({ ...prev, ...patch }))
  const meta = EVENT_TYPE_META[form.type]
  const validationError = validateEventForm(form, now)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validationError) {
      setShowErrors(true)
      return
    }
    setIsSubmitting(true)
    try {
      await addAnimalEvent(animal.id, buildEventRequest(form, now))
      toast.success(`${meta.label} — zapisano dla ${animalDisplayName(animal)}`)
      onSaved?.()
      onClose()
    } catch (error) {
      toast.error(apiErrorMessage(error, "Nie udało się zapisać zdarzenia"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <DialogHeader className="gap-0.5">
        <DialogTitle className="text-[17px]">Dodaj zdarzenie</DialogTitle>
        <DialogDescription className="text-[13px]">
          {animalDisplayName(animal)}
          {animal.earTagNumber && ` · ${animal.earTagNumber}`}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-1.5">
        <div
          role="radiogroup"
          aria-label="Typ zdarzenia"
          className="flex flex-wrap gap-1.5"
        >
          {MANUAL_EVENT_TYPES.map((type) => {
            const active = type === form.type
            return (
              <button
                key={type}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => update({ type })}
                className={cn(
                  "h-8 rounded-lg border px-3 text-[13px] font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                {EVENT_TYPE_META[type].label}
              </button>
            )
          })}
        </div>
        {meta.hint && (
          <p className="text-xs text-muted-foreground">{meta.hint}</p>
        )}
      </div>

      {form.type === "PREGNANCY_CHECK" && (
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-normal text-muted-foreground">
            Wynik badania
          </Label>
          <SegmentedControl
            ariaLabel="Wynik badania cielności"
            options={PREGNANCY_RESULTS}
            value={form.pregnancyResult}
            onChange={(pregnancyResult) => update({ pregnancyResult })}
          />
        </div>
      )}

      {form.type === "BCS" && (
        <Field
          label={`Ocena kondycji (${BCS_MIN}–${BCS_MAX})`}
          htmlFor="event-bcs"
        >
          <Input
            id="event-bcs"
            inputMode="decimal"
            placeholder="np. 3,25"
            className="h-[38px]"
            value={form.bcs}
            aria-invalid={
              showErrors && form.type === "BCS" && !!validationError
            }
            onChange={(e) => update({ bcs: e.target.value })}
          />
        </Field>
      )}

      <Field label="Data" htmlFor="event-date">
        <Input
          id="event-date"
          type="date"
          className="h-[38px]"
          value={form.date}
          max={emptyEventForm(form.type, now).date}
          onChange={(e) => update({ date: e.target.value })}
        />
      </Field>

      <Field label="Notatka (opcjonalnie)" htmlFor="event-note">
        <Textarea
          id="event-note"
          rows={2}
          placeholder="np. byk HOLANDIA-082, lek. wet. Nowak"
          value={form.note}
          onChange={(e) => update({ note: e.target.value })}
        />
      </Field>

      {showErrors && validationError && (
        <p role="alert" className="text-xs text-destructive">
          {validationError}
        </p>
      )}

      <DialogFooter className="mt-1">
        <Button
          type="button"
          variant="outline"
          className="h-[38px] px-3.5"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Anuluj
        </Button>
        <Button
          type="submit"
          className="h-[38px] px-4 font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Zapisywanie…" : "Zapisz"}
        </Button>
      </DialogFooter>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-normal text-muted-foreground"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}
