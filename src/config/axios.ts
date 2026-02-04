import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
    console.warn('[Axios] VITE_API_URL is not defined. Requests will fail. Set it in your .env');
}

// Main axios instance with authentication interceptor
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

// Public axios instance without authentication (for public endpoints)
export const publicAxios = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 30000,
});

// --- Refresh Token Logic Variables ---
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token!);
        }
    });

    failedQueue = [];
};

// Add request interceptor to automatically add token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and it's not a retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return axiosInstance(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Determine refresh token source: either from localStorage or via cookie (if backend supports cookie)
                // Here we assume the refresh token is the SAME as the access token (common in some simple JWT setups) 
                // OR checking if we have a separate logic. 
                // Based on `authService.ts`, `refreshTokenApi` sends `{ token: "..." }`.
                // We will use publicAxios to avoid circular dependency with authService
                const currentToken = localStorage.getItem('token');
                
                if (!currentToken) {
                    throw new Error('No token found');
                }

                const response = await publicAxios.post('/auth/refresh-token', { 
                    token: currentToken 
                });

                if (response.data.code === 1000 || response.data.code === 0) {
                   const { token: newToken } = response.data.data;
                   
                   // 1. Update Storage
                   localStorage.setItem('token', newToken);

                   // 2. Update defaults
                   axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                   originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                   // 3. Process Queue
                   processQueue(null, newToken);

                   // 4. Dispatch Event for React Context
                   window.dispatchEvent(new CustomEvent('auth:refreshed'));

                   return axiosInstance(originalRequest);
                } else {
                    throw new Error('Refresh failed');
                }

            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Force cleanup
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                // Determine if we should redirect. 
                // Usually yes, but verify we are not already on login page
                 if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                 }
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For other errors, log detailed error information and reject
        console.error('API Error Details:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            fullError: error
        });
        return Promise.reject(error);
    }
);

export default axiosInstance;
