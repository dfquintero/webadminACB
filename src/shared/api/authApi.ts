import { apiClient } from './client';
import { endpoints } from './endpoints';
import { schemas } from './types';

export const authApi = {
  login: (data: z.infer<typeof schemas.auth.login>) =>
    apiClient.post(endpoints.auth.login, data),
  
  register: (data: z.infer<typeof schemas.auth.register>) =>
    apiClient.post(endpoints.auth.register, data),
  
  logout: () =>
    apiClient.post(endpoints.auth.logout),
  
  refresh: (refreshToken: string) =>
    apiClient.post(endpoints.auth.refresh, { refreshToken }),
  
  getCurrentUser: () =>
    apiClient.get(endpoints.auth.me),
};
