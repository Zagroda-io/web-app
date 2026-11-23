import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { config } from "./config"
import { TokenResponse } from "@/types/auth"
import {
  expireSession,
  getAccessToken,
  getRefreshToken,
  updateTokens,
} from "./auth/token-storage"

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor do dodawania tokena do requestów
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor do obsługi odświeżania tokena
let isRefreshing = false
type PendingRequest = {
  resolve: (token: string | null) => void
  reject: (error: unknown) => void
}

let failedQueue: PendingRequest[] = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        isRefreshing = false
        expireSession()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post<TokenResponse>(
          `${config.apiUrl}/auth/refresh`,
          {
            refreshToken,
          }
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data
        updateTokens(accessToken, newRefreshToken)

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`
        processQueue(null, accessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        // RequireAuth przeniesie użytkownika do logowania.
        expireSession()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
