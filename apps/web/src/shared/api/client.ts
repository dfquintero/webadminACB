import axios from 'axios';
import { z } from 'zod';

export const SESSION_EXPIRED_EVENT = 'acb:session-expired';
export const apiClient = axios.create({ baseURL: '/bff/v1', timeout: 15000, withCredentials: true });
const csrfResponse = z.object({ token: z.string().min(1) });

apiClient.interceptors.request.use(async config => {
  if (!['get', 'head', 'options'].includes(config.method?.toLowerCase() ?? 'get')) {
    const response = await apiClient.get<unknown>('/auth/csrf');
    config.headers.set('x-csrf-token', csrfResponse.parse(response.data).token);
  }
  return config;
});

apiClient.interceptors.response.use(response => response, (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401 && typeof window !== 'undefined') {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
  return Promise.reject(error);
});
