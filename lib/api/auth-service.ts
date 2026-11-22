import apiClient from "@/lib/api-client"
import { clearTokens } from "@/lib/auth/token-storage"
import {
  LoginRequest,
  TokenResponse,
  RefreshRequest,
  LogoutRequest,
  RegisterRequest,
} from "@/types/auth"

/** Endpointy `/api/v1/auth/*` z core-api (AuthController). */
export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>("/auth/login", data)
    return response.data
  },

  /** Konto jest nieaktywne, dopóki użytkownik nie kliknie linku z e-maila. */
  register: async (data: RegisterRequest): Promise<void> => {
    await apiClient.post("/auth/register", data)
  },

  refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>("/auth/refresh", data)
    return response.data
  },

  logout: async (data: LogoutRequest): Promise<void> => {
    await apiClient.post("/auth/logout", data)
    clearTokens()
  },

  /**
   * Logowanie kodem SMS (US-01.1). Tych endpointów jeszcze nie ma w core-api —
   * to ten sam proponowany kontrakt, którego używa aplikacja mobilna.
   */
  requestSmsCode: async (phoneNumber: string): Promise<void> => {
    await apiClient.post("/auth/otp/request", { phoneNumber })
  },

  verifySmsCode: async (
    phoneNumber: string,
    code: string
  ): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>("/auth/otp/verify", {
      phoneNumber,
      code,
    })
    return response.data
  },
}
