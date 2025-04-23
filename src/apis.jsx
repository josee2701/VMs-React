import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL || 'https://vms-5saw.onrender.com/';
const api = axios.create({ baseURL: baseUrl });
export default api;