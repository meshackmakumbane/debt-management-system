import axios from 'axios';

const LINK = import.meta.env.VITE_API_URL;

const api = axios.create({
<<<<<<< HEAD
  baseURL: `${LINK}/v1/api`,
=======
  baseURL: 'https://debt-management-system-6.onrender.com/v1/api',
>>>>>>> 0ca7b112b6949b4807eb6509cedf0c6be5be1eba
  withCredentials: true,
});

export default api;
<<<<<<< HEAD

=======
>>>>>>> 0ca7b112b6949b4807eb6509cedf0c6be5be1eba
