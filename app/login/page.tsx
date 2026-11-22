"use client"

import { GuestOnly } from "@/components/auth/guest-only"
import { LoginPanel } from "@/components/auth/login-panel"

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginPanel />
    </GuestOnly>
  )
}
