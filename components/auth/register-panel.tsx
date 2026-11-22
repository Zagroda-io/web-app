"use client"

import Link from "next/link"
import * as React from "react"
import { Clock, Inbox, Mail, ShieldCheck, Sprout } from "lucide-react"
import { toast } from "sonner"

import {
  BrandMarkPlaceholder,
  FieldError,
  FormAlert,
  OrDivider,
  PasswordStrengthMeter,
  ZButton,
  ZCheckbox,
  ZField,
  ZInput,
  ZPasswordInput,
  ZPhoneInput,
  zButtonClass,
  zLinkClass,
} from "@/components/auth/auth-ui"
import { AuthShell, RegisterBrandAside } from "@/components/auth/auth-shell"
import { authService } from "@/lib/api/auth-service"
import { registerErrorMessage } from "@/lib/auth/auth-errors"
import {
  isCompletePhone,
  isEmail,
  isPasswordValid,
  passwordStrength,
  toE164,
} from "@/lib/auth/validation"
import { cn } from "@/lib/utils"

type FieldErrors = {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  phone?: string
  terms?: string
}

function comingSoonGoogle() {
  toast.info("Wkrótce", {
    description: "Rejestracja przez Google będzie dostępna w kolejnej wersji.",
  })
}

/**
 * W2 Rejestracja — ten sam przepływ co w aplikacji mobilnej (A5):
 * `POST /auth/register`, potem „Sprawdź skrzynkę”. core-api aktywuje konto
 * dopiero po kliknięciu linku z e-maila; gospodarstwo użytkownik dodaje po zalogowaniu.
 */
export function RegisterPanel() {
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [accepted, setAccepted] = React.useState(false)
  const [errors, setErrors] = React.useState<FieldErrors>({})
  const [formError, setFormError] = React.useState<string | null>(null)
  const [submitting, setSubmitting] = React.useState(false)
  const [sentTo, setSentTo] = React.useState<string | null>(null)

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: FieldErrors = {
      firstName: firstName.trim() ? undefined : "Wpisz imię.",
      lastName: lastName.trim() ? undefined : "Wpisz nazwisko.",
      email: isEmail(email) ? undefined : "Wpisz poprawny adres e-mail.",
      password: isPasswordValid(password)
        ? undefined
        : "Hasło musi mieć min. 8 znaków, w tym cyfrę.",
      phone: phone && !isCompletePhone(phone) ? "Numer telefonu ma 9 cyfr." : undefined,
      terms: accepted
        ? undefined
        : "Zaakceptuj regulamin i politykę prywatności, żeby założyć konto.",
    }
    setErrors(next)
    setFormError(null)
    if (Object.values(next).some(Boolean)) return

    setSubmitting(true)
    try {
      await authService.register({
        // core-api trzyma jedno pole `fullName` — tak samo wysyła je aplikacja mobilna.
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password,
        phoneNumber: phone ? toE164(phone) : undefined,
      })
      setSentTo(email.trim())
    } catch (error) {
      setFormError(registerErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      aside={<RegisterBrandAside />}
      topRight={
        <>
          Masz już konto?{" "}
          <Link href="/login" className={zLinkClass}>
            Zaloguj się
          </Link>
        </>
      }
    >
      {sentTo ? (
        <CheckInbox email={sentTo} onChangeEmail={() => setSentTo(null)} />
      ) : (
        <form noValidate onSubmit={submit} className="flex w-full max-w-[440px] flex-col gap-3.5">
          <div className="flex flex-col gap-1.5 pb-1">
            <h1 className="text-[32px] leading-[38px] font-bold tracking-[-0.02em]">Załóż konto</h1>
            <p className="text-[17px] leading-6 text-z-ink-2">
              Zajmie to minutę. Dane gospodarstwa podasz w następnym kroku.
            </p>
          </div>

          <ZButton type="button" variant="light" block onClick={comingSoonGoogle}>
            <BrandMarkPlaceholder />
            Kontynuuj z Google
          </ZButton>

          <OrDivider>lub e-mailem</OrDivider>

          <div className="grid grid-cols-2 gap-2.5">
            <ZField label="Imię" htmlFor="reg-first-name" error={errors.firstName}>
              <ZInput
                id="reg-first-name"
                autoComplete="given-name"
                value={firstName}
                invalid={!!errors.firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                  clearError("firstName")
                }}
              />
            </ZField>
            <ZField label="Nazwisko" htmlFor="reg-last-name" error={errors.lastName}>
              <ZInput
                id="reg-last-name"
                autoComplete="family-name"
                value={lastName}
                invalid={!!errors.lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                  clearError("lastName")
                }}
              />
            </ZField>
          </div>

          <ZField label="E-mail" htmlFor="reg-email" error={errors.email}>
            <ZInput
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              invalid={!!errors.email}
              onChange={(e) => {
                setEmail(e.target.value)
                clearError("email")
              }}
            />
          </ZField>

          <ZField
            label="Hasło"
            htmlFor="reg-password"
            error={errors.password}
            below={<PasswordStrengthMeter strength={passwordStrength(password)} />}
          >
            <ZPasswordInput
              id="reg-password"
              autoComplete="new-password"
              value={password}
              invalid={!!errors.password}
              onChange={(e) => {
                setPassword(e.target.value)
                clearError("password")
              }}
            />
          </ZField>

          <ZField
            label="Telefon"
            hint="opcjonalnie, do SMS-a przy alercie krytycznym"
            htmlFor="reg-phone"
            error={errors.phone}
          >
            <ZPhoneInput
              id="reg-phone"
              placeholder="600 000 000"
              value={phone}
              invalid={!!errors.phone}
              onDigitsChange={(digits) => {
                setPhone(digits)
                clearError("phone")
              }}
            />
          </ZField>

          <div
            className={cn(
              "flex flex-col gap-1 rounded-2xl border bg-z-surface-2 pt-1.5 pr-3.5 pb-2 pl-1",
              errors.terms ? "border-z-red-line" : "border-z-line"
            )}
          >
            <ZCheckbox
              id="reg-terms"
              checked={accepted}
              invalid={!!errors.terms}
              describedBy={errors.terms ? "reg-terms-error" : undefined}
              onCheckedChange={(value) => {
                setAccepted(value)
                clearError("terms")
              }}
            >
              Akceptuję{" "}
              <Link href="/terms" target="_blank" className={zLinkClass}>
                Regulamin
              </Link>{" "}
              i{" "}
              <Link href="/privacy" target="_blank" className={zLinkClass}>
                Politykę prywatności
              </Link>{" "}
              <span className="text-z-red-ink" aria-hidden>
                *
              </span>
            </ZCheckbox>
            {errors.terms ? (
              <div className="pl-3" role="alert">
                <FieldError id="reg-terms-error">{errors.terms}</FieldError>
              </div>
            ) : null}
          </div>

          {formError ? <FormAlert message={formError} /> : null}

          <ZButton type="submit" size="lg" block loading={submitting}>
            Załóż konto
          </ZButton>

          <p className="flex items-start gap-2 text-xs leading-4 text-z-ink-3">
            <ShieldCheck className="mt-px size-[15px] flex-none" aria-hidden />
            <span>
              Administratorem Twoich danych jest Zagroda.io. Przetwarzamy je, żeby prowadzić Twoje
              konto i wysyłać alerty. Twoje prawa opisujemy w{" "}
              <Link href="/privacy" className={zLinkClass}>
                Polityce prywatności
              </Link>
              .
            </span>
          </p>
        </form>
      )}
    </AuthShell>
  )
}

/** W2b — po wysłaniu formularza. Konto czeka na kliknięcie linku z e-maila. */
function CheckInbox({ email, onChangeEmail }: { email: string; onChangeEmail: () => void }) {
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="flex w-full max-w-[440px] animate-rise-in flex-col gap-4">
      <span className="inline-flex size-16 items-center justify-center rounded-[20px] bg-z-green-100 text-z-accent">
        <Mail className="size-7" aria-hidden />
      </span>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="text-[32px] leading-[38px] font-bold tracking-[-0.02em] outline-none"
      >
        Sprawdź skrzynkę
      </h1>
      <p className="text-[17px] leading-6 text-z-ink-2">
        Wysłaliśmy link aktywacyjny na <b className="font-semibold text-z-ink">{email}</b>. Kliknij
        go, a potem zaloguj się do Zagrody.
      </p>
      <div className="flex flex-col gap-3 rounded-[20px] border border-z-line bg-z-surface px-[18px] py-4 text-z-ink-2">
        <span className="flex items-start gap-2.5">
          <Clock className="mt-0.5 size-[18px] flex-none text-z-ink-3" aria-hidden />
          Link jest ważny przez 24 godziny.
        </span>
        <span className="flex items-start gap-2.5">
          <Inbox className="mt-0.5 size-[18px] flex-none text-z-ink-3" aria-hidden />
          Nie widzisz wiadomości? Sprawdź foldery Spam i Oferty.
        </span>
        <span className="flex items-start gap-2.5">
          <Sprout className="mt-0.5 size-[18px] flex-none text-z-ink-3" aria-hidden />
          Po zalogowaniu dodasz gospodarstwo, tak samo jak w aplikacji na telefonie.
        </span>
      </div>
      <Link href="/login" className={zButtonClass({ size: "lg", block: true })}>
        Przejdź do logowania
      </Link>
      <ZButton type="button" variant="ghost" block onClick={onChangeEmail} className="text-[15px]">
        Zmień adres e-mail
      </ZButton>
    </div>
  )
}
