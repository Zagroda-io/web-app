"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, DownloadIcon, PlusIcon, EllipsisIcon, SendIcon, TrendingUpIcon, BeefIcon, DropletIcon, PackageIcon } from "lucide-react"

export default function Page() {
  const [activeItem, setActiveItem] = React.useState("Panel główny")

  const renderContent = () => {
    switch (activeItem) {
      case "Panel główny":
        return (
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">Panel główny</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>15 Kwi 2026 - 22 Kwi 2026</span>
                </Button>
                <Button variant="default">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">Eksportuj raport</span>
                </Button>
              </div>
            </div>

            <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Stan stada</CardTitle>
                  <CardDescription>Podsumowanie liczebności inwentarza.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {[
                    { name: "Krowy mleczne", count: "42 szt.", trend: "+2", icon: <DropletIcon className="size-4 text-blue-500" /> },
                    { name: "Jałówki", count: "15 szt.", trend: "0", icon: <BeefIcon className="size-4 text-orange-500" /> },
                    { name: "Cielęta", count: "8 szt.", trend: "+1", icon: <TrendingUpIcon className="size-4 text-green-500" /> },
                  ].map((group, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-muted rounded-full">
                          {group.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">{group.name}</p>
                          <p className="text-sm text-muted-foreground">Aktualny stan</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{group.count}</p>
                        <p className={`text-xs ${group.trend.startsWith('+') ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {group.trend !== '0' ? group.trend : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Wydajność mleczna</CardTitle>
                  <CardDescription>Średnia produkcja dobowa (litry).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">1,240 L</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">+4.2%</span> względem wczoraj
                  </p>
                  <div className="mt-6 h-[100px] w-full flex items-end gap-1">
                    {[65, 50, 75, 80, 70, 85, 90, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary rounded-t-sm" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-4">
                    <Avatar className="size-8">
                      <AvatarImage src="/images/avatars/04.png" />
                      <AvatarFallback>JK</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">Jan Kowalski</CardTitle>
                      <CardDescription className="text-xs">Weterynarz</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full size-8">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm w-max max-w-[80%]">
                      Dzień dobry, czy podano już suplementy dla grupy B?
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm ml-auto w-max max-w-[80%]">
                      Tak, wszystko podane zgodnie z planem rano.
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center space-x-2">
                    <div className="flex-1 h-9 rounded-md border bg-muted/50 px-3 py-1 text-sm flex items-center text-muted-foreground text-xs">
                      Napisz wiadomość do zespołu...
                    </div>
                    <Button size="icon" className="size-9">
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="font-semibold">Ostatnie zdarzenia</CardTitle>
                    <CardDescription>Najnowsze odnotowane aktywności w gospodarstwie.</CardDescription>
                  </div>
                  <div className="h-9 w-64 rounded-md border bg-muted/50 px-3 py-1 text-sm flex items-center text-muted-foreground">
                    Szukaj zdarzenia...
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zwierzę</TableHead>
                        <TableHead>Typ zdarzenia</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { animal: "PL002345", type: "Wycielenie", date: "Dzisiaj, 06:20", status: "Zakończone" },
                        { animal: "PL005678", type: "Szczepienie", date: "Wczoraj, 14:00", status: "Zakończone" },
                        { animal: "PL001122", type: "Kontrola wagi", date: "13 Kwi 2026", status: "Planowane" },
                      ].map((event, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{event.animal}</TableCell>
                          <TableCell>{event.type}</TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>
                            <Badge variant={event.status === 'Zakończone' ? 'default' : 'secondary'} className="capitalize">
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="size-8">
                              <EllipsisIcon className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Zapasy</CardTitle>
                  <CardDescription>Stan kluczowych materiałów eksploatacyjnych.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {[
                    { item: "Paliwo (ON)", amount: "450 L", level: 30, icon: <PackageIcon className="size-4" /> },
                    { item: "Pasza treściwa", amount: "1.2 t", level: 65, icon: <PackageIcon className="size-4" /> },
                    { item: "Sól lizawka", amount: "15 szt.", level: 85, icon: <PackageIcon className="size-4" /> },
                  ].map((stock, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {stock.icon}
                          <span className="font-medium">{stock.item}</span>
                        </div>
                        <span className="text-muted-foreground">{stock.amount}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${stock.level < 40 ? 'bg-destructive' : 'bg-primary'}`} 
                          style={{ width: `${stock.level}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Zamów materiały</Button>
                </CardFooter>
              </Card>
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
                    <div className="text-sm font-semibold">{event.date.split('-')[2]}</div>
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
                      <div className="font-semibold">Zwierzę: {treatment.animal}</div>
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
          <SiteHeader />
          <div className="flex flex-1 flex-col overflow-auto">
            <div className="bg-muted/40 flex flex-1 flex-col p-4 lg:p-6">
              <div className="@container/main flex flex-1 flex-col gap-4 w-full">
                {renderContent()}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
