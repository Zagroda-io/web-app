import { getCowById } from "@/api/stado"
import { CowProfile } from "@/components/stado/cow-profile/CowProfile"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface CowProfilePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function CowProfilePage({ params }: CowProfilePageProps) {
  const resolvedParams = await params
  const cowId = parseInt(resolvedParams.id)

  if (isNaN(cowId)) {
    notFound()
  }

  let cow
  try {
    cow = await getCowById(cowId)
  } catch (error) {
    console.error("Błąd ładowania danych krowy:", error)
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Błąd połączenia z API</h2>
        <p className="mt-2 text-muted-foreground">
          Nie udało się pobrać danych zwierzęcia.
        </p>
      </div>
    )
  }

  if (!cow) {
    notFound()
  }

  return (
    <div className="flex flex-1 flex-col">
      <CowProfile
        cow={cow}
        isLoading={false}
        onBackUrl="/dashboard/stado"
        onCowClickUrlBase="/dashboard/stado"
      />
    </div>
  )
}
