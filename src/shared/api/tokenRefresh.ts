import axios from 'axios';

export async function tokenRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh`, { refreshToken });
    if (data.accessToken) sessionStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  } catch {
    return null;
  }
}
