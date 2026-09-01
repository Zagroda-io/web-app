/**
 * Odmiana rzeczownika przez liczbę wg reguł polskich.
 *
 * Angielskie `count === 1 ? x : y` daje tu „2 urządzeń" zamiast „2 urządzenia",
 * bo polski ma trzy formy: pojedynczą, mnogą „few" (2–4) i mnogą „many" (0, 5–21, …).
 *
 * @example pluralPl(1, "urządzenie", "urządzenia", "urządzeń")  // "urządzenie"
 * @example pluralPl(3, "urządzenie", "urządzenia", "urządzeń")  // "urządzenia"
 * @example pluralPl(5, "urządzenie", "urządzenia", "urządzeń")  // "urządzeń"
 */
export function pluralPl(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const abs = Math.abs(count)
  if (abs === 1) {
    return one
  }
  const lastDigit = abs % 10
  const lastTwoDigits = abs % 100
  // 12–14 to wyjątek: „12 urządzeń", mimo że kończą się na 2–4.
  const isTeen = lastTwoDigits >= 12 && lastTwoDigits <= 14
  return lastDigit >= 2 && lastDigit <= 4 && !isTeen ? few : many
}
