import axios from 'axios';
import { sessionResponseSchema, type LoginInput, type SessionResponse } from '@acb/contracts';
import { apiClient } from './client';
import { endpoints } from './endpoints';

export const authApi = {
  login: async (input: LoginInput): Promise<SessionResponse> => {
    const response = await apiClient.post<unknown>(endpoints.auth.login, input);
    return sessionResponseSchema.parse(response.data);
  },
  logout: async (): Promise<void> => { await apiClient.post(endpoints.auth.logout); },
  getCurrentUser: async (): Promise<SessionResponse | null> => {
    try {
      const response = await apiClient.get<unknown>(endpoints.auth.me);
      return sessionResponseSchema.parse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) return null;
      throw error;
    }
  },
};
