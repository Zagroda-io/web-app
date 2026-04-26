"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { PageAnimate } from "@/components/page-animate"
import { LoginForm } from "@/components/login-form"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CommandIcon } from "lucide-react"
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
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted/50 p-6 md:p-10">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <CommandIcon className="size-4" />
            </div>
            Zagroda.io
          </a>
          <LoginForm />
        </div>
      </div>
    </PageAnimate>
  )
}
