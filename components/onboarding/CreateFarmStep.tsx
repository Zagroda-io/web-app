"use client"

import React, { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { userService } from "@/api/user-service"
import { useUser } from "@/context/UserContext"
import { toast } from "sonner"

interface CreateFarmStepProps {
  onSuccess: (farmId: string) => void
}

export const CreateFarmStep: React.FC<CreateFarmStepProps> = ({
  onSuccess,
}) => {
  const [name, setName] = useState("")
  const [type, setType] = useState("cattle")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)
  const { refreshUser } = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) return

    setLoading(true)
    try {
      const { data } = await userService.createFarm({ name, type, location })
      toast.success("Gospodarstwo zostało utworzone")
      await refreshUser()
      onSuccess(data.id)
    } catch (error) {
      console.error(error)
      toast.error("Nie udało się utworzyć gospodarstwa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Utwórz swoje pierwsze gospodarstwo</CardTitle>
        <CardDescription>
          Zacznij od podania podstawowych informacji o swojej farmie.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="farm-name">Nazwa gospodarstwa *</Label>
            <Input
              id="farm-name"
              placeholder="np. Gospodarstwo pod dębami"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm-type">Typ gospodarstwa</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="farm-type">
                <SelectValue placeholder="Wybierz typ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cattle">Bydło</SelectItem>
                <SelectItem value="swine">Trzoda chlewna</SelectItem>
                <SelectItem value="mixed">Mieszane</SelectItem>
                <SelectItem value="other">Inne</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="farm-location">Lokalizacja</Label>
            <Input
              id="farm-location"
              placeholder="np. Miejscowość, Województwo"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading || !name}>
            {loading ? "Tworzenie..." : "Dalej"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
