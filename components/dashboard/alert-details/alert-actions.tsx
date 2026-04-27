"use client"

import React from "react"
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  MinusCircle,
  Plus,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function AlertActions() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Akcje</h3>
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
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 w-auto gap-2 border-border bg-muted/20 px-3 text-xs text-muted-foreground"
            disabled
          >
            <Plus className="h-3.5 w-3.5" />
            Utwórz
          </Button>
          <Button
            variant="outline"
            className="h-9 w-auto gap-2 border-border px-3 text-xs text-foreground hover:bg-muted/50"
          >
            <MinusCircle className="h-3.5 w-3.5 text-blue-500" />
            Ignoruj
          </Button>
          <Button
            variant="outline"
            className="h-9 w-auto gap-2 border-border px-3 text-xs text-foreground hover:bg-muted/50"
          >
            <UserPlus className="h-3.5 w-3.5 text-blue-500" />
            Przypisz
          </Button>
          <Button
            variant="outline"
            className="h-9 w-auto gap-2 border-border px-3 text-xs text-foreground hover:bg-muted/50"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-500" />
            Dziennik
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
