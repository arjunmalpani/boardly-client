import { create } from 'zustand';
import { axioscall } from '@/lib/axios';
import toast from 'react-hot-toast';

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    // login call
    loginUser: async (credentials) => {
        const response = await axioscall.post('/auth/login', credentials);
        const loggedInUser = response.data.user;
        set({ user: loggedInUser, isAuthenticated: true })
    },
    registerUser: async (userData) => {
        const response = await axioscall.post('/auth/register', userData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        const newUser = response.data.user;
        set({ user: newUser, isAuthenticated: true })
    },
    logoutUser: async () => {
        try {
            await axioscall.get('/auth/logout');
            set({ user: null, isAuthenticated: false });
            toast.success('Logout successful');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Logout failed. Please try again.');
        }
    },
    checkAuth: async () => {
        try {
            const response = await axioscall.get('/auth/check');
            set({ user: response.data, isLoading: false, isAuthenticated: true });
        } catch (error) {
            set({ user: null, isLoading: false, isAuthenticated: false });
        }
    }
}))

export default useAuthStore;