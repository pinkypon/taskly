// resources/js/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://train-react.test', // Laravel backend
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// ✅ Use instance here to ensure cookies are handled correctly
export const csrf = () => instance.get('/sanctum/csrf-cookie');

export default instance;
