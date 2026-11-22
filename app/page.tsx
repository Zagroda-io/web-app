"use client"

import { GuestOnly } from "@/components/auth/guest-only"
import { LoginPanel } from "@/components/auth/login-panel"

export default function Page() {
  return (
    <GuestOnly>
      <LoginPanel />
    </GuestOnly>
  )
}
