"use client"

import { useParams } from "next/navigation"
import { ApiErrorState } from "@/components/shared/ApiErrorState"
import { CowProfile } from "@/components/stado/cow-profile/CowProfile"
import { CowProfileSkeleton } from "@/components/stado/cow-profile/CowProfileSkeleton"
import { useAnimalDetails } from "@/hooks/use-herd"

export default function CowProfilePage() {
  const params = useParams()
  const cowId = params.id as string
  const animal = useAnimalDetails(cowId)

  if (animal.error && !animal.isLoading) {
    return (
      <ApiErrorState
        message="Nie udało się pobrać danych zwierzęcia."
        onRetry={animal.reload}
      />
    )
  }
  // Dane poprzedniej krowy zostają w hooku do czasu nadejścia nowych — nie pokazujemy ich pod cudzym adresem.
  if (!animal.data || animal.data.id !== cowId) {
    return <CowProfileSkeleton />
  }

  return (
    <CowProfile
      animal={animal.data}
      backHref="/dashboard/stado"
      onRefresh={animal.reload}
    />
  )
}
