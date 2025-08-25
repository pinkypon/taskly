// resources/js/lib/axios.ts - Corrected for Laravel 12
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://train-react.test',
    withCredentials: true, // ✅ Required for SPA auth
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        Accept: 'application/json', // ✅ Required by docs
    },
});

// ✅ Set these on your instance, not global axios
instance.defaults.withCredentials = true; // ✅ Already set above, but explicit is good
instance.defaults.withXSRFToken = true; // ✅ NEW Laravel 12 feature - automatic CSRF handling

// ✅ Use instance here to ensure cookies are handled correctly
export const csrf = () => instance.get('/sanctum/csrf-cookie');

export default instance;
