import { formatDistanceToNow, parseISO } from 'date-fns'
import { pl } from 'date-fns/locale'

/**
 * Formats a date string into a relative human-readable format in Polish.
 * Example: "2 godziny temu", "3 dni temu"
 */
export function formatRelativeDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: pl })
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}
