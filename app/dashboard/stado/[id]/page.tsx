"use client"

import { getAnimalDetails } from "@/api/stado"
import { CowProfile } from "@/components/stado/cow-profile/CowProfile"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { notFound, useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import type { AnimalDetails } from "@/lib/types/stado.types"

export default function CowProfilePage() {
  const params = useParams()
  const cowId = params.id as string

  const [animal, setAnimal] = useState<AnimalDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)

  const loadData = useCallback(async () => {
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
  }, [cowId])

  useEffect(() => {
    if (cowId) {
      loadData()
    }
  }, [cowId, loadData])

  if (error) {
    return (
      <ApiErrorState
        message="Nie udało się pobrać danych zwierzęcia."
        onRetry={loadData}
      />
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
