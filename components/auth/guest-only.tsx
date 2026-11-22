"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useAuth } from "@/hooks/use-auth"

/** Ekrany wejścia: zalogowanego użytkownika od razu przenosi do panelu. */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (isAuthenticated && !isLoading) router.replace("/dashboard")
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-z-bg">
        <div className="size-12 animate-spin rounded-full border-b-2 border-z-ink" />
      </div>
    )
  }

  return <>{children}</>
}
