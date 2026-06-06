"use client"

import StadoView from "@/components/stado/StadoView"
import { getHerdFeed, getHerdSummary } from "@/api/stado"
import { useCallback, useEffect, useRef, useState } from "react"
import type { FeedEvent, HerdSummary } from "@/lib/types/stado.types"

export default function StadoPage() {
  const [data, setData] = useState<{
    feed: FeedEvent[]
    summary: HerdSummary
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [summaryError, setSummaryError] = useState(false)
  const [feedError, setFeedError] = useState(false)
  const isInitialMount = useRef(true)

  const loadSummary = useCallback(async () => {
    try {
      setSummaryError(false)
      const summary = await getHerdSummary()
      setData((prev) => ({
        feed: prev?.feed || [],
        summary: summary || {
          totalCows: NaN,
          activeAlertCount: NaN,
          plannedInseminationCount: NaN,
          lastSyncAt: new Date().toISOString(),
        },
      }))
    } catch (err) {
      console.error("Błąd ładowania podsumowania stada:", err)
      setSummaryError(true)
    }
  }, [])

  const loadFeed = useCallback(async () => {
    try {
      setFeedError(false)
      const feed = await getHerdFeed({ limit: 3 })
      setData((prev) => ({
        summary: prev?.summary || {
          totalCows: NaN,
          activeAlertCount: NaN,
          plannedInseminationCount: NaN,
          lastSyncAt: new Date().toISOString(),
        },
        feed,
      }))
    } catch (err) {
      console.error("Błąd ładowania feedu stada:", err)
      setFeedError(true)
    }
  }, [])

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true)
      await Promise.allSettled([loadSummary(), loadFeed()])
      setIsLoading(false)
    }

    if (isInitialMount.current) {
      loadInitialData()
      isInitialMount.current = false
    }
  }, [loadSummary, loadFeed])

  if (isLoading && !data) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const summary = data?.summary || {
    totalCows: NaN,
    activeAlertCount: NaN,
    plannedInseminationCount: NaN,
    lastSyncAt: new Date().toISOString(),
  }

  const feed = data?.feed || []

  return (
    <div className="flex flex-1 flex-col">
      <StadoView
        initialFeed={feed}
        summary={summary}
        summaryError={summaryError}
        feedError={feedError}
        onRetrySummary={loadSummary}
        onRetryFeed={loadFeed}
      />
    </div>
  )
}
