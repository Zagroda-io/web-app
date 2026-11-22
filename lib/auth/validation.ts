/** Reguły formularzy logowania i rejestracji — te same co w aplikacji mobilnej. */

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isPasswordValid(password: string): boolean {
  return password.length >= 8 && /\d/.test(password)
}

export type PasswordStrength = 0 | 1 | 2 | 3

/**
 * 0 — puste, 1 — słabe (nie spełnia minimum), 2 — dobre (min. 8 znaków
 * i cyfra), 3 — silne (do tego 12+ znaków albo litery różnej wielkości i znak specjalny).
 */
export function passwordStrength(password: string): PasswordStrength {
  if (!password) return 0
  if (!isPasswordValid(password)) return 1
  const mixedCase =
    /[a-ząćęłńóśźż]/.test(password) && /[A-ZĄĆĘŁŃÓŚŹŻ]/.test(password)
  const special = /[^\p{L}\p{N}]/u.test(password)
  return password.length >= 12 || (mixedCase && special) ? 3 : 2
}

/** Polskie numery komórkowe: 9 cyfr, prefiks +48. */
export const PHONE_PREFIX = "+48"
export const PHONE_DIGITS = 9

/** Zostawia same cyfry (maks. 9) z tego, co wpisał albo wkleił użytkownik. */
export function normalizePhone(input: string): string {
  let digits = input.replace(/\D/g, "")
  if (digits.length > PHONE_DIGITS && digits.startsWith("48")) {
    digits = digits.slice(2)
  }
  return digits.slice(0, PHONE_DIGITS)
}

/** „601234567” → „601 234 567”. */
export function formatPhone(digits: string): string {
  return digits.replace(/(\d{3})(?=\d)/g, "$1 ")
}

export function isCompletePhone(digits: string): boolean {
  return digits.length === PHONE_DIGITS
}

/** „601234567” → „+48601234567” (format API). */
export function toE164(digits: string): string {
  return `${PHONE_PREFIX}${digits}`
}
