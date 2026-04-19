import apiClient from '@/lib/api-client';
import { LoginRequest, TokenResponse, RefreshRequest } from '@/types/auth';

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data);
    return response.data;
  },

  refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
