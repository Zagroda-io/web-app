import apiClient from '@/lib/api-client';
import { LoginRequest, TokenResponse, RefreshRequest, LogoutRequest } from '@/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', data);
    return response.data;
  },

  logout: async (data: LogoutRequest): Promise<void> => {
    await apiClient.post('/auth/logout', data);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
