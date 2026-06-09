import axios from 'axios';

const api = axios.create({
  baseURL: 'https://debt-management-system-6.onrender.com/v1/api',
  withCredentials: true,
});

export default api;
