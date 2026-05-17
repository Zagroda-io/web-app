import apiClient from '@/lib/api-client';
import { Farm, UserFarmsResponse } from '@/types/farm';

export const farmService = {
  /**
   * Pobiera listę gospodarstw powiązanych z zalogowanym użytkownikiem.
   * Wywoływany po zalogowaniu w celu zainicjalizowania kontekstu gospodarstwa.
   */
  getMyFarms: async (): Promise<UserFarmsResponse> => {
    const response = await apiClient.get<UserFarmsResponse>('/farms/me');
    return response.data;
  },

  /**
   * Pobiera szczegółowe informacje o konkretnym gospodarstwie.
   */
  getFarmDetails: async (farmId: string): Promise<Farm> => {
    const response = await apiClient.get<Farm>(`/farms/${farmId}`);
    return response.data;
  },

  /**
   * Ustawia aktywne gospodarstwo dla sesji (opcjonalnie, jeśli API tego wymaga).
   */
  setActiveFarm: async (farmId: string): Promise<void> => {
    await apiClient.post(`/farms/${farmId}/select`);
  }
};
