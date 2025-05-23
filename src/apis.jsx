import axios from 'axios';
//const baseUrl = 'http://localhost:8000'; //Development URL
const baseUrl = 'https://vms-5saw.onrender.com/'; //Production URL
const api = axios.create({ baseURL: baseUrl });

// Antes de cada petición, inyecta el Authorization si hay token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
export default api;