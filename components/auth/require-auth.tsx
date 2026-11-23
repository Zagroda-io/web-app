"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useAuth } from "@/hooks/use-auth"

/**
 * Panel tylko dla zalogowanych: bez sesji (albo gdy wygaśnie) przenosi do logowania.
 * Dzieci — w tym UserProvider, który pyta API o gospodarstwa — montują się dopiero z sesją.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login")
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div
        className="flex h-screen w-full items-center justify-center"
        role="status"
        aria-label="Sprawdzamy sesję"
      >
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <>{children}</>
}
