"use client"

import { getAnimalDetails } from "@/api/stado"
import { CowProfile } from "@/components/stado/cow-profile/CowProfile"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { AnimalDetails } from "@/lib/types/stado.types"

export default function CowProfilePage() {
  const params = useParams()
  const cowId = params.id as string

  const [animal, setAnimal] = useState<AnimalDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const data = await getAnimalDetails(cowId)
        setAnimal(data)
        setError(false)
      } catch (err) {
        console.error("Błąd ładowania danych zwierzęcia:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (cowId) {
      loadData()
    }
  }, [cowId])

  if (error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Błąd połączenia z API
        </h2>
        <p className="mt-2 text-muted-foreground">
          Nie udało się pobrać danych zwierzęcia.
        </p>
      </div>
    )
  }

  if (!isLoading && !animal) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col">
      <CowProfile
        animal={animal}
        isLoading={isLoading}
        onBackUrl="/dashboard/stado"
        onCowClickUrlBase="/dashboard/stado"
      />
    </div>
  )
}
