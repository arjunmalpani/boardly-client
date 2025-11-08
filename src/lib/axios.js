import axios from 'axios';

export const axioscall = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? process.env.VITE_BACKEND_URL : 'http://localhost:5001/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});