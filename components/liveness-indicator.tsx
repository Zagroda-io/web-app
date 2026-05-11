"use client"

import React, { useEffect, useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function LivenessIndicator() {
  const [status, setStatus] = useState<"online" | "warning" | "offline">(
    "online"
  )

  // Prosta symulacja sprawdzania połączenia (można rozbudować o rzeczywisty ping/healthcheck)
  useEffect(() => {
    const handleOnline = () => setStatus("online")
    const handleOffline = () => setStatus("offline")

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const statusMap = {
    online: {
      color: "bg-green-500",
      label: "Połączono",
    },
    warning: {
      color: "bg-orange-500",
      label: "Problemy z połączeniem",
    },
    offline: {
      color: "bg-red-500",
      label: "Brak połączenia",
    },
  }

  const current = statusMap[status]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex h-8 w-8 cursor-help items-center justify-center">
            <span className="relative flex h-3 w-3">
              {status === "online" && (
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    current.color
                  )}
                ></span>
              )}
              <span
                className={cn(
                  "relative inline-flex h-3 w-3 rounded-full",
                  current.color
                )}
              ></span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{current.label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
