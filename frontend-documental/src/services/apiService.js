import axios from 'axios';

// Configuración base de axios - URL DIRECTA DE AZURE
const api = axios.create({
  baseURL: 'https://gestion-documental-api-cloud-gucxdbdxb5bac4gf.australiaeast-01.azurewebsites.net',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para requests (agregar token, etc.)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses (manejo global de errores)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;