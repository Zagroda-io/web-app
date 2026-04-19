"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { PageAnimate } from "@/components/page-animate"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import React from "react"

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  React.useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <PageAnimate>
      <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </PageAnimate>
  )
}
