import type { AlertSeverity } from "@/lib/types/stado.types"

interface AlertTypeMeta {
  label: string
  severity: AlertSeverity
  badgeClass: string
}

const DEFAULT_META: AlertTypeMeta = {
  label: "Alert",
  severity: "info",
  badgeClass:
    "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-900/30 dark:text-slate-400 dark:border-slate-800/30",
}

/** Mapowanie typu alertu AI na etykietę, wagę i styl badge'a (spójne z EventFeedItem). */
export const ALERT_TYPE_META: Record<string, AlertTypeMeta> = {
  CALVING: {
    label: "Poród",
    severity: "red",
    badgeClass:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  },
  ESTRUS: {
    label: "Ruja",
    severity: "amber",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  },
  FALL: {
    label: "Upadek",
    severity: "red",
    badgeClass:
      "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  },
  ANOMALY: {
    label: "Anomalia",
    severity: "amber",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  },
}

export function alertTypeMeta(type: string): AlertTypeMeta {
  return ALERT_TYPE_META[type] ?? DEFAULT_META
}

/** Pewność modelu jako procent, np. 0.8697 → "87%". */
export function formatConfidence(confidence: number | null): string {
  if (confidence === null || confidence === undefined || isNaN(confidence)) {
    return "—"
  }
  return `${Math.round(confidence * 100)}%`
}
