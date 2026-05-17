export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export interface LoginRequest {
  email?: string
  phoneNumber?: string
  password?: string
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

import { Farm } from "./farm"

export interface UserInfoResponse {
  farms: Farm[]
  activeFarmId: string | null
}
