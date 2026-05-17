"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function AddCowSheet() {
  const [open, setOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Tutaj normalnie byłaby logika zapisu
    console.log("Dodawanie nowej krowy...")
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Dodaj krowę
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Dodaj nową krowę</SheetTitle>
            <SheetDescription>
              Wprowadź dane nowej krowy, aby dodać ją do swojego stada.
            </SheetDescription>
          </SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            <div className="grid gap-2">
              <Label htmlFor="earTagNumber">Numer kolczyka</Label>
              <Input id="earTagNumber" placeholder="PL 005000000000" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Imię</Label>
              <Input id="name" placeholder="Np. Bella" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="breed">Rasa</Label>
              <Select defaultValue="HO">
                <SelectTrigger id="breed">
                  <SelectValue placeholder="Wybierz rasę" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HO">HO (Holsztyno-fryzyjska)</SelectItem>
                  <SelectItem value="RW">RW (Polska Czerwono-biała)</SelectItem>
                  <SelectItem value="JE">JE (Jersey)</SelectItem>
                  <SelectItem value="SI">SI (Simental)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="birthDate">Data urodzenia</Label>
              <Input id="birthDate" type="date" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lactationNumber">Numer laktacji</Label>
              <Input
                id="lactationNumber"
                type="number"
                min="0"
                defaultValue="0"
                required
              />
            </div>
          </div>
          <SheetFooter className="border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="submit">Zapisz krowę</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
