"use client"

import { useState } from "react"
import { Loader2, Unlink } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { assignSensorToAnimal, unassignSensorFromAnimal } from "@/lib/api/sensors"
import { apiErrorMessage } from "@/lib/api-error"
import { SensorSelect } from "./SensorSelect"
import { formatDevEui } from "./sensor-utils"

interface AssignSensorDialogProps {
  animal: { id: string; name: string; sensorId: string | null }
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Po zmianie czujnika — rodzic odświeża dane krowy. */
  onChanged: () => void
}

/**
 * Przypisanie, zmiana albo odłączenie czujnika krowy (profil krowy).
 * Zmiana na inny czujnik jest jednym wywołaniem — backend podmienia przypisanie.
 */
export function AssignSensorDialog({
  animal,
  open,
  onOpenChange,
  onChanged,
}: AssignSensorDialogProps) {
  const [selected, setSelected] = useState(animal.sensorId ?? "")
  const [pending, setPending] = useState<"save" | "unassign" | null>(null)

  const handleOpenChange = (next: boolean) => {
    if (next) setSelected(animal.sensorId ?? "")
    onOpenChange(next)
  }

  const run = async (action: "save" | "unassign") => {
    setPending(action)
    try {
      if (action === "unassign" || !selected) {
        await unassignSensorFromAnimal(animal.id)
        toast.success(`Odłączono czujnik od krowy ${animal.name}.`)
      } else {
        await assignSensorToAnimal(animal.id, selected)
        toast.success(
          `Krowa ${animal.name} nosi teraz czujnik ${formatDevEui(selected)}.`
        )
      }
      onChanged()
      onOpenChange(false)
    } catch (err) {
      console.error("Nie udało się zmienić czujnika krowy:", err)
      toast.error(apiErrorMessage(err, "Nie udało się zmienić czujnika krowy."))
    } finally {
      setPending(null)
    }
  }

  const unchanged = (selected || null) === (animal.sensorId || null)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Czujnik krowy {animal.name}</DialogTitle>
          <DialogDescription>
            Wybierz czujnik z puli gospodarstwa. Widoczne są tylko aktywne, wolne
            czujniki zwierzęce.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="animal-sensor">Czujnik</Label>
          <SensorSelect
            id="animal-sensor"
            value={selected}
            onChange={setSelected}
            animalId={animal.id}
            currentSensorId={animal.sensorId}
            disabled={pending !== null}
          />
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          {animal.sensorId ? (
            <Button
              type="button"
              variant="ghost"
              className="gap-2 text-muted-foreground"
              disabled={pending !== null}
              onClick={() => run("unassign")}
            >
              {pending === "unassign" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Unlink className="h-4 w-4" />
              )}
              Odłącz czujnik
            </Button>
          ) : (
            <span />
          )}
          <Button
            type="button"
            disabled={pending !== null || unchanged}
            onClick={() => run("save")}
            className="gap-2"
          >
            {pending === "save" && <Loader2 className="h-4 w-4 animate-spin" />}
            Zapisz
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
