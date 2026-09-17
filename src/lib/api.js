// Axios provides one reusable HTTP client for calls to the backend API.
import axios from "axios";
import { clearAuth, getAuth } from "./auth";

// Keeping the server address in one place makes API calls easier to maintain.
export const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
     baseURL: API_BASE_URL
});

export function resolveMediaUrl(value) {
     if (!value || /^(https?:|data:|blob:)/i.test(value)) return value || "";
     return `${API_BASE_URL}/${String(value).replaceAll("\\", "/").replace(/^\/+/, "").split("/").map(encodeURIComponent).join("/")}`;
}

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
