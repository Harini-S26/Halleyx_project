import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('halleyx_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('halleyx_token');
      localStorage.removeItem('halleyx_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
