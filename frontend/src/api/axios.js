import axios from 'axios';

const LINK = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${LINK}v1/api`  || 'https://debt-management-system-6.onrender.com/v1/api',
  withCredentials: true,
});

export default api;
