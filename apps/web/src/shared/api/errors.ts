import axios from 'axios';
import { apiErrorSchema } from '@acb/contracts';

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError(error)) return fallback;
  const parsed = apiErrorSchema.safeParse(error.response?.data);
  return parsed.success ? parsed.data.error.message : fallback;
};
