"use client"

import {
  ChevronDown,
  ChevronUp,
  Clock,
  Info,
  Link as LinkIcon,
  Play,
  Search,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import React from "react"

interface PredictedEntity {
  match: number
  type: string
  id: string
  subType: string
}

interface AlertEntitiesProps {
  entities: PredictedEntity[]
}

export function AlertEntities({ entities }: AlertEntitiesProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null)

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Przewidywane obiekty
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground"
            >
              <Search className="h-3.5 w-3.5" />
            </Button>
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
        </div>

        <CollapsibleContent>
          <div className="space-y-2">
            {entities.map((entity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-lg border bg-card p-2 shadow-sm dark:bg-muted/10"
              >
                <div className="flex min-w-[80px] shrink-0 flex-col items-center justify-center border-r py-1 pr-3">
                  <span className="text-[13px] font-bold text-foreground">
                    {entity.match}%
                  </span>
                  <span className="text-center text-[9px] font-medium tracking-tight text-muted-foreground uppercase">
                    Dopasowanie
                  </span>
                </div>

                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <div className="rounded bg-muted p-1.5 dark:bg-muted/50">
                    {/* Ikona krowy lub generyczna */}
                    <span className="text-sm">🐄</span>
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold whitespace-nowrap text-foreground">
                        {entity.type}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-foreground">
                        •
                      </span>
                      <span className="text-xs font-bold whitespace-nowrap text-foreground uppercase">
                        {entity.id}
                      </span>
                    </div>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {entity.subType}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 pr-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
                    onClick={() => setSelectedVideo(entity.id)}
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 border-blue-200 bg-blue-50/30 px-2.5 text-blue-600 hover:bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-400 dark:hover:bg-blue-950/40"
                  >
                    <LinkIcon className="h-3 w-3" />
                    <span className="text-xs font-semibold">Link</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Sheet
        open={!!selectedVideo}
        onOpenChange={(open) => !open && setSelectedVideo(null)}
      >
        <SheetContent
          side="bottom"
          className="h-[80vh] overflow-hidden rounded-t-xl border-t bg-background p-0 shadow-2xl sm:h-[600px]"
        >
          <SheetHeader className="flex flex-row items-center justify-between space-y-0 border-b bg-background px-6 py-4">
            <div>
              <SheetTitle className="flex items-center gap-2 text-lg">
                <Video className="size-5 text-blue-500" />
                Nagranie zdarzenia — Obiekt {selectedVideo}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Analiza AI zarejestrowanego zachowania (10 sekund)
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="relative flex h-full w-full flex-col items-center justify-center bg-zinc-950 p-6">
            <div className="group relative aspect-video w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-muted/10">
              {/* Symulacja wideo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex size-16 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm transition-all group-hover:bg-white/20">
                    <Play className="ml-1 size-8 fill-current text-white" />
                  </div>
                  <p className="text-sm font-medium text-zinc-400">
                    Kliknij, aby odtworzyć materiał
                  </p>
                </div>
              </div>

              {/* Overlay AI */}
              <div className="absolute top-4 left-4 rounded border border-white/10 bg-black/40 p-2 backdrop-blur-md">
                <div className="mb-1 flex items-center gap-2">
                  <div className="size-2 animate-pulse rounded-full bg-red-500" />
                  <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                    AI Analysis Live
                  </span>
                </div>
                <div className="text-[11px] text-white/80">
                  Wykryto:{" "}
                  <span className="font-bold text-blue-400 uppercase">
                    {selectedVideo}
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="absolute right-4 bottom-4 left-4 h-1 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-[65%] bg-blue-500" />
              </div>
              <div className="absolute right-4 bottom-6 left-4 flex justify-between font-mono text-[10px] text-zinc-400">
                <span>00:00:07 / 00:00:10</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" /> 2026-04-28 00:41
                </span>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                onClick={() => setSelectedVideo(null)}
              >
                Zamknij podgląd
              </Button>
              <Button className="border-none bg-blue-600 text-white hover:bg-blue-700">
                Pobierz nagranie
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
