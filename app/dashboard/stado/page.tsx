"use client"

import { Suspense } from "react"
import StadoView from "@/components/stado/StadoView"
import StadoLoading from "./loading"

export default function StadoPage() {
  // useSearchParams wymaga granicy Suspense przy renderowaniu po stronie serwera.
  return (
    <Suspense fallback={<StadoLoading />}>
      <StadoView />
    </Suspense>
  )
}
