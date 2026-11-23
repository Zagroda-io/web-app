"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { isAxiosError } from "axios"
import { userService } from "@/lib/api/user-service"
import { Farm } from "@/types/farm"
import { getAccessToken } from "@/lib/auth/token-storage"

interface UserContextType {
  farms: Farm[]
  activeFarm: Farm | null
  fullName: string | null
  email: string | null
  loading: boolean
  /**
   * Komunikat, gdy nie udało się pobrać danych użytkownika (sieć, błąd serwera).
   * Wtedy nie wiemy, czy gospodarstwa są — panel nie może pokazać onboardingu.
   */
  error: string | null
  switchFarm: (farmId: string) => Promise<void>
  /**
   * Pobiera dane konta ponownie. `silent` — bez stanu ładowania i bez ekranu błędu:
   * panel zostaje na miejscu (np. pod ekranem powitania po konfiguracji).
   */
  refreshUser: (options?: { silent?: boolean }) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [farms, setFarms] = useState<Farm[]>([])
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null)
  const [profile, setProfile] = useState<{ fullName: string | null; email: string | null }>({
    fullName: null,
    email: null,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    try {
      if (!silent) {
        setLoading(true)
        setError(null)
      }
      const { data } = await userService.getUserInfo()
      setFarms(data.farms)
      setActiveFarmId(data.activeFarmId)
      setProfile({ fullName: data.fullName ?? null, email: data.email ?? null })
    } catch (err) {
      console.error("Błąd ładowania danych użytkownika", err)
      // 401 kończy sesję w api-client, a RequireAuth przenosi do logowania.
      // Ciche odświeżenie nie zasłania panelu błędem — zostają poprzednie dane.
      if (!silent && !(isAxiosError(err) && err.response?.status === 401)) {
        setError(
          isAxiosError(err) && !err.response
            ? "Nie możemy połączyć się z serwerem. Sprawdź internet i spróbuj ponownie."
            : "Nie udało się wczytać danych gospodarstwa. Spróbuj ponownie za chwilę."
        )
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Ładujemy dane zaraz po zainicjalizowaniu providera (np. po zalogowaniu)
    if (getAccessToken()) {
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
      value={{
        farms,
        activeFarm,
        fullName: profile.fullName,
        email: profile.email,
        loading,
        error,
        switchFarm,
        refreshUser: loadData,
      }}
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
