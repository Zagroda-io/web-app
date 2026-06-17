"use client"

import { useState } from "react"
import { toast } from "sonner"
import { format, parseISO, isValid } from "date-fns"
import { pl } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { addAnimalEvent } from "@/api/stado"
import type { AnimalEventType } from "@/lib/types/stado.types"

interface AddEventDialogProps {
  animalId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

const EVENT_TYPES: { value: AnimalEventType; label: string; hint?: string }[] = [
  { value: "CALVING", label: "Poród", hint: "Ustawia status: w laktacji" },
  { value: "DRY_OFF", label: "Zasuszenie", hint: "Ustawia status: zasuszona" },
  {
    value: "INSEMINATION",
    label: "Inseminacja",
    hint: "Wyznacza przewidywane wycielenie",
  },
  { value: "PREGNANCY_CHECK", label: "Badanie cielności" },
  { value: "ESTRUS", label: "Ruja" },
  { value: "VET", label: "Wizyta weterynaryjna" },
  { value: "BCS", label: "Ocena kondycji (BCS)" },
  { value: "NOTE", label: "Notatka" },
]

export function AddEventDialog({
  animalId,
  open,
  onOpenChange,
  onSaved,
}: AddEventDialogProps) {
  const [type, setType] = useState<AnimalEventType>("CALVING")
  const [occurredAt, setOccurredAt] = useState<string>("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedHint = EVENT_TYPES.find((t) => t.value === type)?.hint
  const date = occurredAt ? parseISO(occurredAt) : undefined

  const reset = () => {
    setType("CALVING")
    setOccurredAt("")
    setTitle("")
    setDescription("")
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await addAnimalEvent(animalId, {
        type,
        occurredAt: occurredAt || undefined,
        title: title || undefined,
        description: description || undefined,
      })
      toast.success("Zdarzenie zostało zapisane")
      reset()
      onOpenChange(false)
      onSaved?.()
    } catch (error) {
      console.error("Błąd zapisu zdarzenia:", error)
      toast.error("Nie udało się zapisać zdarzenia")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj zdarzenie</DialogTitle>
          <DialogDescription>
            Zarejestruj zdarzenie z życia zwierzęcia. Niektóre typy automatycznie
            zmieniają jego status.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Typ zdarzenia</Label>
            <Select
              value={type}
              onValueChange={(v) => setType(v as AnimalEventType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedHint && (
              <p className="text-[11px] text-muted-foreground">{selectedHint}</p>
            )}
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Data zdarzenia</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !occurredAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date && isValid(date) ? (
                    format(date, "PPP", { locale: pl })
                  ) : (
                    <span>Dziś (domyślnie)</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => setOccurredAt(d ? d.toISOString() : "")}
                  locale={pl}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Tytuł</Label>
            <Input
              placeholder="np. Wycielenie — jałówka"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground">Opis</Label>
            <Input
              placeholder="Dodatkowe informacje (opcjonalnie)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Zapisywanie…" : "Zapisz zdarzenie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
