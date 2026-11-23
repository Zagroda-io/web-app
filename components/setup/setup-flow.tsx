"use client"

import * as React from "react"

import { SetupWelcome } from "@/components/setup/setup-welcome"
import { DoneStep } from "@/components/setup/steps/done-step"
import { FarmStep } from "@/components/setup/steps/farm-step"
import { HerdStep } from "@/components/setup/steps/herd-step"
import { NotificationsStep } from "@/components/setup/steps/notifications-step"
import { finishSetup, saveSetupStep, type SetupStep } from "@/lib/setup/setup-state"
import type { Farm } from "@/types/farm"

/**
 * Po pierwszym logowaniu: W5 powitanie → W6 gospodarstwo → stado → powiadomienia → gotowe.
 * Ten sam przebieg co B0–B3 w aplikacji mobilnej. Krok zapisuje się po każdym przejściu,
 * więc po odświeżeniu strony użytkownik wraca tam, gdzie skończył.
 */
export function SetupFlow({
  initialStep,
  farm: initialFarm,
  owner,
  fullName,
  email,
  onFinish,
}: {
  /** `null` — zaczynamy od powitania. */
  initialStep: SetupStep | null
  farm: Farm | null
  /** E-mail konta — klucz zapisanego postępu. */
  owner: string | null
  fullName: string | null
  email: string | null
  onFinish: (href?: string) => void
}) {
  const [step, setStep] = React.useState<SetupStep | null>(initialStep)
  const [farm, setFarm] = React.useState<Farm | null>(initialFarm)

  const go = (next: SetupStep) => {
    saveSetupStep(owner, next)
    setStep(next)
    window.scrollTo({ top: 0 })
  }

  const finish = (href?: string) => {
    finishSetup(owner)
    onFinish(href)
  }

  if (step === null) {
    return <SetupWelcome fullName={fullName} onStart={() => go("farm")} />
  }

  // Bez gospodarstwa dalsze kroki nie mają sensu — zawsze najpierw krok 1.
  if (step === "farm" || !farm) {
    return (
      <FarmStep
        onCreated={(created) => {
          setFarm(created)
          go("herd")
        }}
      />
    )
  }

  if (step === "herd") {
    return <HerdStep farmId={farm.id} onNext={() => go("notifications")} onSkip={() => go("notifications")} />
  }

  if (step === "notifications") {
    return <NotificationsStep email={email} onBack={() => go("herd")} onDone={() => go("done")} />
  }

  return (
    <DoneStep farm={farm} onFinish={finish} onEnableNotifications={() => go("notifications")} />
  )
}
