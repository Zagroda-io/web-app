"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { userService } from "@/api/user-service"
import { Farm } from "@/types/farm"

interface UserContextType {
  farms: Farm[]
  activeFarm: Farm | null
  loading: boolean
  switchFarm: (farmId: string) => Promise<void>
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const { data } = await userService.getUserInfo()
      setFarms(data.farms)
      setActiveFarmId(data.activeFarmId)
    } catch (err) {
      console.error("Błąd ładowania danych użytkownika", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Ładujemy dane zaraz po zainicjalizowaniu providera (np. po zalogowaniu)
    if (typeof window !== "undefined" && localStorage.getItem("accessToken")) {
      loadData()
    } else {
      setLoading(false)
    }
  }, [loadData])

  const switchFarm = async (farmId: string) => {
    try {
      await userService.setActiveFarm(farmId)
      setActiveFarmId(farmId)
    } catch (err) {
      console.error("Nie udało się zmienić gospodarstwa", err)
    }
  }

  const activeFarm = farms.find((f) => f.id === activeFarmId) || null

  return (
    <UserContext.Provider
      value={{ farms, activeFarm, loading, switchFarm, refreshUser: loadData }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context)
    throw new Error("useUser musi być używane wewnątrz UserProvider")
  return context
}
