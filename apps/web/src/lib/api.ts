import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('guardianrs_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('guardianrs_refresh_token');
          if (refreshToken) {
            const res = await axios.post(`${api.defaults.baseURL}/auth/refresh-token`, { refreshToken });
            if (res.data.success) {
              const { token } = res.data.data;
              localStorage.setItem('guardianrs_token', token);
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return api(originalRequest);
            }
          }
        }
      } catch (err) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('guardianrs_token');
          localStorage.removeItem('guardianrs_refresh_token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
