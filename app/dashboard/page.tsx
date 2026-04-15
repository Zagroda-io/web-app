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
import { CalendarIcon, DownloadIcon, PlusIcon, EllipsisIcon, SendIcon } from "lucide-react"

export default function Page() {
  const [activeItem, setActiveItem] = React.useState("Panel główny")

  const renderContent = () => {
    switch (activeItem) {
      case "Panel główny":
        return (
          <div className="space-y-4">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-xl font-semibold tracking-tight lg:text-2xl">Dashboard</h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>18 Mar 2026 - 14 Apr 2026</span>
                </Button>
                <Button variant="default">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  <span className="hidden lg:inline">Download</span>
                </Button>
              </div>
            </div>

            <div className="gap-4 space-y-4 lg:grid lg:grid-cols-3 lg:space-y-0">
              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Team Members</CardTitle>
                  <CardDescription>Invite your team members to collaborate.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {[
                    { name: "Toby Belhome", email: "contact@bundui.io", role: "Viewer", avatar: "01" },
                    { name: "Jackson Lee", email: "pre@example.com", role: "Developer", avatar: "02" },
                    { name: "Hally Gray", email: "hally@site.com", role: "Viewer", avatar: "03" },
                  ].map((member, i) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="size-8">
                          <AvatarImage src={`/images/avatars/${member.avatar}.png`} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{member.name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-auto">
                        {member.role}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-semibold">Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">+4850</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">+180.1%</span> from last month
                  </p>
                  <div className="mt-6 h-[100px] w-full flex items-end gap-1">
                    {[40, 70, 45, 60, 50, 65, 70, 45].map((h, i) => (
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
                      <AvatarFallback>SD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-sm">Sofia Davis</CardTitle>
                      <CardDescription className="text-xs">m@example.com</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="rounded-full size-8">
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg px-3 py-2 text-sm w-max max-w-[80%]">
                      Hi, how can I help you today?
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm ml-auto w-max max-w-[80%]">
                      Hey, I'm having trouble with my account.
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex w-full items-center space-x-2">
                    <div className="flex-1 h-9 rounded-md border bg-muted/50 px-3 py-1 text-sm flex items-center text-muted-foreground">
                      Type your message...
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
                    <CardTitle className="font-semibold">Latest Payments</CardTitle>
                    <CardDescription>See recent payments from your customers here.</CardDescription>
                  </div>
                  <div className="h-9 w-64 rounded-md border bg-muted/50 px-3 py-1 text-sm flex items-center text-muted-foreground">
                    Filter payments...
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { name: "Kenneth Thompson", email: "ken99@yahoo.com", amount: "$316.00", status: "success" },
                        { name: "Abraham Lincoln", email: "abe45@gmail.com", amount: "$242.00", status: "success" },
                        { name: "Monserrat Rodriguez", email: "monserrat44@gmail.com", amount: "$837.00", status: "processing" },
                      ].map((payment, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{payment.name}</TableCell>
                          <TableCell>{payment.email}</TableCell>
                          <TableCell>{payment.amount}</TableCell>
                          <TableCell>
                            <Badge variant={payment.status === 'success' ? 'default' : 'secondary'} className="capitalize">
                              {payment.status}
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
                  <CardTitle className="font-semibold">Payment Method</CardTitle>
                  <CardDescription>Add a new payment method to your account.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-3 gap-4">
                    {['Card', 'Paypal', 'Apple'].map((method) => (
                      <div key={method} className="flex flex-col items-center justify-between rounded-md border-2 p-4 hover:bg-muted cursor-pointer transition-colors">
                        <div className="mb-2 h-6 w-6 bg-muted-foreground/20 rounded" />
                        <span className="text-xs font-medium">{method}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Name on the card</p>
                    <div className="h-9 rounded-md border px-3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Continue</Button>
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
          <SiteHeader title={activeItem} />
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
