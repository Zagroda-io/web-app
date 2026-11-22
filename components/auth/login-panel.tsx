"use client"

import Link from "next/link"
import * as React from "react"
import { Clock, Lock, Mail, Smartphone } from "lucide-react"
import { toast } from "sonner"

import {
  BrandMarkPlaceholder,
  CodeInput,
  FormAlert,
  OrDivider,
  ZButton,
  ZField,
  ZInput,
  ZPasswordInput,
  ZPhoneInput,
  zLinkClass,
} from "@/components/auth/auth-ui"
import { AuthShell, LoginBrandAside } from "@/components/auth/auth-shell"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/api/auth-service"
import { loginErrorMessage, smsErrorMessage } from "@/lib/auth/auth-errors"
import { formatPhone, isCompletePhone, isEmail, toE164 } from "@/lib/auth/validation"
import { cn } from "@/lib/utils"

const CODE_LENGTH = 6
const RESEND_SECONDS = 60

type Mode = "email" | "phone"

function formatCountdown(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

function comingSoonGoogle() {
  toast.info("Wkrótce", {
    description: "Logowanie przez Google będzie dostępne w kolejnej wersji.",
  })
}

/** W1 Logowanie — e-mail i hasło albo numer telefonu z kodem SMS. */
export function LoginPanel() {
  const [mode, setMode] = React.useState<Mode>("email")

  return (
    <AuthShell
      aside={<LoginBrandAside />}
      topRight={
        <>
          Nie masz konta?{" "}
          <Link href="/register" className={zLinkClass}>
            Załóż konto
          </Link>
        </>
      }
    >
      <div className="flex w-full max-w-[420px] flex-col gap-4">
        <div className="flex flex-col gap-1.5 pb-1">
          <h1 className="text-[32px] leading-[38px] font-bold tracking-[-0.02em]">Witaj ponownie</h1>
          <p className="text-[17px] leading-6 text-z-ink-2">Zaloguj się do swojego gospodarstwa.</p>
        </div>

        <ZButton type="button" variant="light" block onClick={comingSoonGoogle}>
          <BrandMarkPlaceholder />
          Kontynuuj z Google
        </ZButton>

        <OrDivider />

        <div
          role="tablist"
          aria-label="Sposób logowania"
          className="flex gap-1 rounded-[14px] bg-z-bg-sunken p-1"
        >
          <ModeTab active={mode === "email"} onSelect={() => setMode("email")} controls="login-email">
            <Mail className="size-[18px]" aria-hidden />
            E-mail
          </ModeTab>
          <ModeTab active={mode === "phone"} onSelect={() => setMode("phone")} controls="login-phone">
            <Smartphone className="size-[18px]" aria-hidden />
            Telefon
          </ModeTab>
        </div>

        {mode === "email" ? <EmailLogin /> : <PhoneLogin />}

        <p className="pt-1 text-center text-[13.5px] leading-[19px] text-z-ink-3">
          Kontynuując, akceptujesz{" "}
          <Link href="/terms" className={zLinkClass}>
            Regulamin
          </Link>{" "}
          i{" "}
          <Link href="/privacy" className={zLinkClass}>
            Politykę prywatności
          </Link>
          .
        </p>
      </div>
    </AuthShell>
  )
}

function ModeTab({
  active,
  onSelect,
  controls,
  children,
}: {
  active: boolean
  onSelect: () => void
  controls: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      onClick={onSelect}
      className={cn(
        "flex h-10 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] px-2 text-sm font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-z-ink/25",
        active
          ? "bg-z-surface text-z-ink shadow-[0_1px_2px_rgba(17,26,20,.10),0_0_0_1px_rgba(17,26,20,.04)] dark:bg-z-raised dark:shadow-none"
          : "text-z-ink-3 hover:text-z-ink"
      )}
    >
      {children}
    </button>
  )
}

/* ───────────── e-mail i hasło ───────────── */

function EmailLogin() {
  const { login } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(false)
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const next = {
      email: isEmail(email) ? undefined : "Wpisz poprawny adres e-mail.",
      password: password ? undefined : "Wpisz hasło.",
    }
    setErrors(next)
    setFormError(null)
    if (next.email || next.password) return

    setSubmitting(true)
    try {
      const tokens = await authService.login({ email: email.trim(), password })
      login(tokens.accessToken, tokens.refreshToken, { id: "1", email: email.trim() }, { remember })
    } catch (error) {
      setFormError(loginErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <form
      id="login-email"
      role="tabpanel"
      onSubmit={submit}
      noValidate
      className="flex flex-col gap-4"
    >
      <ZField label="E-mail" htmlFor="login-email-input" error={errors.email}>
        <ZInput
          id="login-email-input"
          type="email"
          autoComplete="email"
          placeholder="jan@gospodarstwo.pl"
          icon={<Mail className="size-[18px]" />}
          value={email}
          invalid={!!errors.email}
          onChange={(e) => {
            setEmail(e.target.value)
            setErrors((c) => ({ ...c, email: undefined }))
          }}
        />
      </ZField>
      <ZField label="Hasło" htmlFor="login-password" error={errors.password}>
        <ZPasswordInput
          id="login-password"
          autoComplete="current-password"
          icon={<Lock className="size-[18px]" />}
          value={password}
          invalid={!!errors.password}
          onChange={(e) => {
            setPassword(e.target.value)
            setErrors((c) => ({ ...c, password: undefined }))
          }}
        />
      </ZField>

      <div className="-mt-1 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-[15px] text-z-ink-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="m-0 size-5 flex-none accent-z-accent"
          />
          Zapamiętaj mnie na tym komputerze
        </label>
        <Link href="/forgot-password" className={cn(zLinkClass, "flex min-h-11 items-center text-[15px]")}>
          Nie pamiętasz hasła?
        </Link>
      </div>

      {formError ? <FormAlert message={formError} /> : null}

      <ZButton type="submit" size="lg" block loading={submitting}>
        Zaloguj się
      </ZButton>
    </form>
  )
}

/* ───────────── telefon i kod SMS ───────────── */

function PhoneLogin() {
  const { login } = useAuth()
  const [step, setStep] = React.useState<"number" | "code">("number")
  const [phone, setPhone] = React.useState("")
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState(false)
  const [secondsLeft, setSecondsLeft] = React.useState(0)

  React.useEffect(() => {
    if (secondsLeft <= 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  async function sendCode() {
    if (!isCompletePhone(phone)) {
      setError("Wpisz 9-cyfrowy numer telefonu.")
      return
    }
    setBusy(true)
    setError(null)
    try {
      await authService.requestSmsCode(toE164(phone))
      setCode("")
      setStep("code")
      setSecondsLeft(RESEND_SECONDS)
    } catch (e) {
      setError(smsErrorMessage(e, "request"))
    } finally {
      setBusy(false)
    }
  }

  async function verify(value = code) {
    if (value.length !== CODE_LENGTH || busy) return
    setBusy(true)
    setError(null)
    try {
      const tokens = await authService.verifySmsCode(toE164(phone), value)
      login(tokens.accessToken, tokens.refreshToken, { id: "1", phoneNumber: toE164(phone) })
    } catch (e) {
      setError(smsErrorMessage(e, "verify"))
      setBusy(false)
    }
  }

  if (step === "number") {
    return (
      <form
        id="login-phone"
        role="tabpanel"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          sendCode()
        }}
        className="flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <ZField label="Numer telefonu" htmlFor="login-phone-input">
            <ZPhoneInput
              id="login-phone-input"
              placeholder="600 000 000"
              value={phone}
              invalid={!!error}
              onDigitsChange={(digits) => {
                setPhone(digits)
                setError(null)
              }}
            />
          </ZField>
          <span className="text-xs text-z-ink-3">
            Wyślemy SMS z jednorazowym kodem. Numer musi być przypisany do Twojego konta.
          </span>
        </div>
        {error ? <FormAlert message={error} /> : null}
        <ZButton type="submit" size="lg" block loading={busy}>
          Wyślij kod SMS
        </ZButton>
      </form>
    )
  }

  return (
    <form
      id="login-phone"
      role="tabpanel"
      noValidate
      onSubmit={(e) => {
        e.preventDefault()
        verify()
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <span id="sms-code-label" className="text-sm leading-[18px] font-semibold text-z-ink-2">
          Kod z SMS-a
        </span>
        <CodeInput
          value={code}
          labelledBy="sms-code-label"
          disabled={busy}
          invalid={!!error}
          onChange={(value) => {
            setCode(value)
            setError(null)
            if (value.length === CODE_LENGTH) verify(value)
          }}
        />
        <p className="pt-1 text-[13.5px] leading-[19px] text-z-ink-3">
          Kod wysłany na {`+48 ${formatPhone(phone)}`}.{" "}
          <button
            type="button"
            onClick={() => {
              setStep("number")
              setError(null)
            }}
            className={cn(zLinkClass, "cursor-pointer")}
          >
            Zmień numer
          </button>
        </p>
      </div>

      <p className="flex items-center gap-1.5 text-[13.5px] leading-[19px] text-z-ink-2">
        <Clock className="size-[15px] flex-none" aria-hidden />
        {secondsLeft > 0 ? (
          <span>
            Nie dostałeś kodu? Wyślij ponownie za{" "}
            <b className="font-bold tabular-nums">{formatCountdown(secondsLeft)}</b>
          </span>
        ) : (
          <span>
            Nie dostałeś kodu?{" "}
            <button type="button" onClick={sendCode} disabled={busy} className={cn(zLinkClass, "cursor-pointer")}>
              Wyślij ponownie
            </button>
          </span>
        )}
      </p>

      {error ? <FormAlert message={error} /> : null}

      <ZButton type="submit" size="lg" block loading={busy} disabled={code.length !== CODE_LENGTH}>
        Zaloguj się
      </ZButton>
    </form>
  )
}
