import axios from "axios";

let initialLoadCompleted = false;

export const setInitialLoadCompleted = (value: boolean) => {
  initialLoadCompleted = value;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_PATH || "",
  withCredentials: true,
  withXSRFToken: true,
});

// Use CSRF token from meta tag (when served from Laravel same-origin)
api.interceptors.request.use((config) => {
  const token = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

// Global Error Handler
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // If the user is unauthorized or their session expired...
        if (error.response && (error.response.status === 401 || error.response.status === 419)) {
            // 1. Clear local storage
            sessionStorage.removeItem('auth-user');
            sessionStorage.removeItem('active-role');
            
            // 2. Redirect to Central Systems Portal
            const centralUrl = import.meta.env.VITE_CENTRAL_SYSTEM_URL + '/ids/oris/home/n' || '/login';
            window.location.href = centralUrl; 
        }
        
        return Promise.reject(error);
    }
);

export default api;