import axios from 'axios';

const LINK = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${LINK}v1/api`  || 'https://debt-management-system-6.onrender.com/v1/api',
});

api.interceptors.request.use((config)=>{
  const token = localStorage.getItem("token")

  if(token){
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config;
})

export default api;
