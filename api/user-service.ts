import apiClient from '@/lib/api-client';
import { UserInfoResponse } from '@/types/auth';
import { Farm } from '@/types/farm';

export const userService = {
  // Pobranie informacji o zalogowanym użytkowniku (w tym listy farm)
  getUserInfo: () => apiClient.get<UserInfoResponse>('/auth/me'),

  // Aktualizacja ostatnio aktywnego gospodarstwa
  setActiveFarm: (farmId: string) => apiClient.patch('/users/me', { lastActiveFarmId: farmId }),

  // Tworzenie nowego gospodarstwa
  createFarm: (data: { name: string; type: string; location?: string }) => 
    apiClient.post<Farm>('/farms', data),
};
