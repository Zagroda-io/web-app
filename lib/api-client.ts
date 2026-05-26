import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import { config } from "./config"
import { TokenResponse } from "@/types/auth"

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
      const token = localStorage.getItem("accessToken")
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
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
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
        return new Promise((resolve, reject) => {
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

      const refreshToken = localStorage.getItem("refreshToken")
      if (!refreshToken) {
        isRefreshing = false
        // Przekierowanie do logowania lub czyszczenie stanu
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
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", newRefreshToken)

        apiClient.defaults.headers.common["Authorization"] =
          `Bearer ${accessToken}`
        processQueue(null, accessToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        // Tutaj można dodać przekierowanie do strony logowania
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
