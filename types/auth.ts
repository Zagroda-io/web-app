export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email?: string
  phoneNumber?: string
  password?: string
}

/** Body `POST /auth/register` (core-api RegisterRequest). */
export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  /** E.164, np. „+48601234567”. */
  phoneNumber?: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface User {
  id: string
  email?: string
  phoneNumber?: string
  name?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
}

import { Farm } from "./farm"

export interface UserInfoResponse {
  farms: Farm[]
  activeFarmId: string | null
  /** Imię i nazwisko z rejestracji — powitanie i inicjały. */
  fullName?: string | null
  email?: string | null
}
