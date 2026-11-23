"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { AuthState, User } from "@/types/auth"
import { authService } from "@/lib/api/auth-service"
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
  SESSION_EXPIRED_EVENT,
} from "@/lib/auth/token-storage"
import { useRouter } from "next/navigation"

interface LoginOptions {
  /** „Zapamiętaj mnie na tym komputerze” — sesja przeżyje zamknięcie przeglądarki. */
  remember?: boolean
}

interface AuthContextType extends AuthState {
  login: (
    accessToken: string,
    refreshToken: string,
    user: User,
    options?: LoginOptions
  ) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const accessToken = getAccessToken()
    const refreshToken = getRefreshToken()
    // W prawdziwej aplikacji tutaj pobralibyśmy też profil użytkownika z API

    if (accessToken && refreshToken) {
      setAuthState({
        user: { id: "1", email: "user@example.com" }, // Placeholder
        accessToken,
        isAuthenticated: true,
      })
    }
    setIsLoading(false)
  }, [])

  // api-client zgłasza wygaśnięcie sesji (401 bez możliwości odświeżenia tokena).
  useEffect(() => {
    const onExpired = () =>
      setAuthState({ user: null, accessToken: null, isAuthenticated: false })
    window.addEventListener(SESSION_EXPIRED_EVENT, onExpired)
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onExpired)
  }, [])

  const login = (
    accessToken: string,
    refreshToken: string,
    user: User,
    { remember = true }: LoginOptions = {}
  ) => {
    saveTokens(accessToken, refreshToken, remember)
    setAuthState({
      user,
      accessToken,
      isAuthenticated: true,
    })
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await authService.logout({ refreshToken })
      }
    } catch (error) {
      console.error("Logout failed:", error)
      // Nawet jeśli API zawiedzie, czyścimy stan lokalny
      clearTokens()
    } finally {
      setAuthState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      })
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
