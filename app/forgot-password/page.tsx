"use client"

import { ForgotPasswordForm } from "@/components/forgot-password-form"
import { ZagrodaLogo } from "@/components/brand/zagroda-logo"
import { PageAnimate } from "@/components/page-animate"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <PageAnimate>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link href="/" className="self-center" aria-label="Zagroda — logowanie">
            <ZagrodaLogo size="sm" />
          </Link>
          <ForgotPasswordForm />
        </div>
      </div>
    </PageAnimate>
  )
}
