"use client"

import React, { useState } from "react"
import {
  Activity,
  Battery,
  Camera,
  Circle,
  Clock,
  Cpu,
  Database,
  Server,
  Wifi,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { fetchHardwareStatus } from "@/api/hardware/liveness"
import { DeviceStatus, HardwareSummary } from "@/types/hardware"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

interface HardwareStatusPopoverProps {
  children: React.ReactNode
}

export function HardwareStatusPopover({
  children,
}: HardwareStatusPopoverProps) {
  const [data, setData] = useState<HardwareSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("cameras")

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchHardwareStatus()
      setData(result)
    } catch (error) {
      console.error("Failed to fetch hardware status:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return "text-green-500"
      case "offline":
        return "text-red-500"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBg = (status: DeviceStatus) => {
    switch (status) {
      case "online":
        return "bg-green-500/10"
      case "offline":
        return "bg-red-500/10"
      case "warning":
        return "bg-yellow-500/10"
      default:
        return "bg-gray-500/10"
    }
  }

  return (
    <Popover onOpenChange={(open) => open && loadData()}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="end">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold tracking-tight">Status urządzeń</h3>
          {loading && (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          )}
        </div>

        <Tabs
          defaultValue="cameras"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="cameras"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Camera className="mr-2 h-4 w-4" />
              Kamery
            </TabsTrigger>
            <TabsTrigger
              value="sensors"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Activity className="mr-2 h-4 w-4" />
              Czujniki
            </TabsTrigger>
            <TabsTrigger
              value="edge"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              <Server className="mr-2 h-4 w-4" />
              Edge
            </TabsTrigger>
          </TabsList>

          <div className="relative max-h-[300px] overflow-hidden p-4">
            {!data ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Ładowanie danych...
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  {activeTab === "cameras" && (
                    <div className="m-0 mt-0 outline-none">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Aktywne kamery
                        </span>
                        <Badge variant="outline" className="font-mono">
                          {data.cameras.online}/{data.cameras.total}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {data.cameras.devices.map((device) => (
                          <div
                            key={device.id}
                            className="flex items-center justify-between rounded-lg border p-2 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <Circle
                                className={cn(
                                  "h-2 w-2 fill-current",
                                  getStatusColor(device.status)
                                )}
                              />
                              <span className="font-medium">{device.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                              <Wifi className="h-3.5 w-3.5" />
                              <span className="text-[10px]">HD</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "sensors" && (
                    <div className="m-0 mt-0 outline-none">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Obroże IoT (aktywne)
                        </span>
                        <Badge variant="outline" className="font-mono">
                          {data.sensors.online}/{data.sensors.total}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {data.sensors.devices.slice(0, 8).map((device) => (
                          <div
                            key={device.id}
                            className={cn(
                              "flex flex-col gap-1 rounded-lg border p-2 text-xs",
                              getStatusBg(device.status)
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="truncate font-medium">
                                {device.name.replace("Obroża IoT ", "#")}
                              </span>
                              <Circle
                                className={cn(
                                  "h-1.5 w-1.5 fill-current",
                                  getStatusColor(device.status)
                                )}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Battery
                                  className={cn(
                                    "h-3 w-3",
                                    device.battery && device.battery < 20
                                      ? "text-red-500"
                                      : "text-green-500"
                                  )}
                                />
                                {device.battery}%
                              </div>
                              {device.status === "online" ? (
                                <Wifi className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {data.sensors.total > 8 && (
                        <p className="mt-3 text-center text-[11px] text-muted-foreground">
                          + {data.sensors.total - 8} więcej urządzeń
                        </p>
                      )}
                    </div>
                  )}

                  {activeTab === "edge" && (
                    <div className="m-0 mt-0 outline-none">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <Server className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm leading-none font-bold tracking-tight text-foreground">
                                Serwer Edge-01
                              </p>
                              <p className="mt-1 text-[10px] text-muted-foreground uppercase">
                                Status: Aktywny
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-600">
                            ONLINE
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-lg border p-3">
                            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                              <Cpu className="h-4 w-4" />
                              <span className="text-[11px] font-medium uppercase">
                                CPU
                              </span>
                            </div>
                            <p className="text-xl font-bold">
                              {data.edgeServer.cpuUsage}%
                            </p>
                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${data.edgeServer.cpuUsage}%`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="rounded-lg border p-3">
                            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                              <Database className="h-4 w-4" />
                              <span className="text-[11px] font-medium uppercase">
                                RAM
                              </span>
                            </div>
                            <p className="text-xl font-bold">
                              {data.edgeServer.ramUsage}%
                            </p>
                            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{
                                  width: `${data.edgeServer.ramUsage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Czas pracy:</span>
                          </div>
                          <span className="font-medium text-foreground">
                            {data.edgeServer.uptime}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </Tabs>
        <div className="bg-muted/30 p-3 text-center">
          <button className="text-[11px] font-medium tracking-wider text-primary uppercase hover:underline">
            Otwórz diagnostykę systemu
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
