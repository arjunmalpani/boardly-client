import axios from 'axios';

export const axioscall = axios.create({
    baseURL: import.meta.env.PROD ? `${import.meta.env.VITE_BACKEND_URL}/api` : 'http://localhost:5001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});