import axios from 'axios';

// Get the backend URL dynamically based on environment
const getBackendURL = () => {
    // Check for custom backend URL in environment variables (set via import.meta.env)
    const backendUrlFromEnv = import.meta.env.VITE_BACKEND_URL;

    if (backendUrlFromEnv) {
        console.log('Using backend URL from env:', backendUrlFromEnv);
        return backendUrlFromEnv;
    }

    // Fallback: use IIS reverse proxy
    const backendUrl = `/api`;
    console.log('Using default backend URL:', backendUrl);
    return backendUrl;
};

// Create Axios instance
const api = axios.create({
    baseURL: getBackendURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Important for CORS if cookies/sessions are used
});

// Request Interceptor (Add Auth Token)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('huc_access_token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (Global Error Handling)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        const data = error?.response?.data;
        const message =
            data?.message ||
            data?.error ||
            error.message ||
            'An unexpected error occurred';

        console.error(`API Error [${status}]:`, message, '| Full response:', data);

        // Token expired or unauthorized — trigger a global logout event
        if (status === 401) {
            window.dispatchEvent(new CustomEvent('auth:logout'));
        }

        // Attach response data to a proper Error object so catch blocks can read it
        const customError = new Error(message) as Error & {
            status?: number;
            responseData?: unknown;
            original?: unknown;
        };
        customError.status = status;
        customError.responseData = data;
        customError.original = error;

        return Promise.reject(customError);
    }
);

export default api;
