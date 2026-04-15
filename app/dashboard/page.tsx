"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Page() {
  const [activeItem, setActiveItem] = React.useState("Panel główny")

  const renderContent = () => {
    switch (activeItem) {
      case "Panel główny":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tight lg:text-2xl">Panel główny</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Liczba zwierząt</div>
                <div className="mt-2 text-2xl font-bold">124</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Ostatnie zdarzenia</div>
                <div className="mt-2 text-2xl font-bold">12</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Aktywne leczenia</div>
                <div className="mt-2 text-2xl font-bold">3</div>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground">Wydajność</div>
                <div className="mt-2 text-2xl font-bold">+2.4%</div>
              </div>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold mb-4">Ostatnia aktywność</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-muted" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Dodano nowe zwierzę do stada</p>
                      <p className="text-xs text-muted-foreground">2 godziny temu</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "Stado":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight">Stado</h2>
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">ID</th>
                    <th className="px-4 py-3 text-left font-medium">Gatunek</th>
                    <th className="px-4 py-3 text-left font-medium">Wiek</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { id: "PL001", species: "Krowa", age: "3 lata", status: "Zdrowa" },
                    { id: "PL002", species: "Krowa", age: "2 lata", status: "Leczenie" },
                    { id: "PL003", species: "Byk", age: "4 lata", status: "Zdrowy" },
                  ].map((animal) => (
                    <tr key={animal.id}>
                      <td className="px-4 py-3">{animal.id}</td>
                      <td className="px-4 py-3">{animal.species}</td>
                      <td className="px-4 py-3">{animal.age}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${animal.status === 'Zdrowa' || animal.status === 'Zdrowy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {animal.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case "Zdarzenia":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight">Zdarzenia</h2>
            <div className="grid gap-4">
              {[
                { date: "2026-04-15", time: "08:00", title: "Karmienie poranne", desc: "Podanie paszy treściwej" },
                { date: "2026-04-15", time: "10:30", title: "Kontrola weterynaryjna", desc: "Przegląd ogólny stada" },
                { date: "2026-04-16", time: "14:00", title: "Transport paszy", desc: "Dostawa od dostawcy" },
              ].map((event, i) => (
                <div key={i} className="flex gap-4 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex flex-col items-center justify-center border-r pr-4 min-w-[80px]">
                    <div className="text-sm font-bold">{event.date.split('-')[2]}</div>
                    <div className="text-xs text-muted-foreground">Kwi</div>
                  </div>
                  <div>
                    <div className="font-semibold">{event.title}</div>
                    <div className="text-sm text-muted-foreground">{event.desc}</div>
                    <div className="mt-2 text-xs font-medium text-primary">{event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case "Leczenie":
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl font-semibold tracking-tight">Leczenie</h2>
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 mb-4">
              <p className="text-sm text-destructive font-medium">Wymagana uwaga: 2 zaległe dawki leku</p>
            </div>
            <div className="space-y-4">
              {[
                { animal: "PL002", medication: "Antybiotyk A", dosage: "20ml", progress: 60 },
                { animal: "PL045", medication: "Witaminy B", dosage: "10ml", progress: 30 },
              ].map((treatment, i) => (
                <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold">Zwierzę: {treatment.animal}</div>
                      <div className="text-sm text-muted-foreground">Lek: {treatment.medication} ({treatment.dosage})</div>
                    </div>
                    <div className="text-sm font-medium">{treatment.progress}%</div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${treatment.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      default:
        return <div>Wybierz sekcję z menu bocznego.</div>
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar 
          variant="inset" 
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
        <SidebarInset className="bg-sidebar-inset">
          <SiteHeader title={activeItem} />
          <div className="flex flex-1 flex-col p-4 lg:p-6 overflow-auto">
            <div className="@container/main flex flex-1 flex-col gap-4 max-w-5xl mx-auto w-full">
              {renderContent()}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
