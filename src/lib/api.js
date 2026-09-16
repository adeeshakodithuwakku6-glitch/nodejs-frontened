// Axios provides one reusable HTTP client for calls to the backend API.
import axios from "axios";
import { clearAuth, getAuth } from "./auth";

// Keeping the server address in one place makes API calls easier to maintain.
const api = axios.create({
     baseURL: "http://localhost:3000"   
});

api.interceptors.request.use((config) => {
     const token = getAuth()?.token || localStorage.getItem("token");
     if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
});

api.interceptors.response.use(
     (response) => response,
     (error) => {
          if (error.response?.status === 401 && !error.config?.url?.includes("/users/login")) {
               clearAuth();
               if (window.location.pathname !== "/login") {
                    window.location.assign("/login");
               }
          }
          return Promise.reject(error);
     },
);
export default api;
