"use client"

import React from "react"
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Radio,
  Target,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface RiskItem {
  description: string
  dataSource: string
  risk: "red" | "yellow" | "green"
  icon: React.ElementType
}

const riskItems: RiskItem[] = [
  {
    description: "Alert zbliżeniowy",
    dataSource: "GPS/Sensor",
    risk: "yellow",
    icon: MapPin,
  },
  {
    description: "Nietypowe zachowanie",
    dataSource: "AI/Wizja",
    risk: "red",
    icon: Target,
  },
  {
    description: "Nieregularna aktywność",
    dataSource: "Tracker aktywności",
    risk: "red",
    icon: TrendingUp,
  },
  {
    description: "Utrata sygnału czujnika",
    dataSource: "Bramka IoT",
    risk: "red",
    icon: Radio,
  },
  {
    description: "Obiekt zainteresowania (VOI)",
    dataSource: "Rejestr systemowy",
    risk: "yellow",
    icon: AlertCircle,
  },
]

export function AlertRiskProfile() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Profil ryzyka</h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="overflow-hidden rounded-lg border bg-card dark:bg-muted/10">
          <Table>
            <TableHeader className="bg-muted/30 dark:bg-muted/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-9 px-4 text-[11px] font-bold text-blue-700/70 dark:text-blue-400/70">
                  Opis
                </TableHead>
                <TableHead className="h-9 px-4 text-[11px] font-bold text-blue-700/70 dark:text-blue-400/70">
                  Źródło danych
                </TableHead>
                <TableHead className="h-9 px-4 text-right text-[11px] font-bold text-blue-700/70 dark:text-blue-400/70">
                  Ryzyko
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riskItems.map((item, idx) => (
                <TableRow key={idx} className="h-10 hover:bg-muted/10">
                  <TableCell className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground/90">
                        {item.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.dataSource}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <div className="flex justify-end">
                      <div
                        className={cn(
                          "h-3 w-3 rounded-full shadow-inner",
                          item.risk === "red"
                            ? "bg-red-500 shadow-red-900/20"
                            : item.risk === "yellow"
                              ? "bg-amber-400 shadow-amber-900/20"
                              : "bg-green-500 shadow-green-900/20"
                        )}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
