// In your api/axios.ts file
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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't do full-page redirect on 401/419 - let ProtectedRoute handle auth
    // via React Router (no refresh). Full redirect caused unwanted auto-refresh.
    return Promise.reject(error);
  },
);

export default api;
