"use client"

import { GuestOnly } from "@/components/auth/guest-only"
import { RegisterPanel } from "@/components/auth/register-panel"

export default function RegisterPage() {
  return (
    <GuestOnly>
      <RegisterPanel />
    </GuestOnly>
  )
}
