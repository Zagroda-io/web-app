import apiClient from '@/lib/api-client';
import { UserInfoResponse } from '@/types/auth';

export const userService = {
  // Pobranie informacji o zalogowanym użytkowniku (w tym listy farm)
  getUserInfo: () => apiClient.get<UserInfoResponse>('/auth/me'),

  // Aktualizacja ostatnio aktywnego gospodarstwa
  setActiveFarm: (farmId: string) => apiClient.patch('/users/me', { lastActiveFarmId: farmId }),
};
