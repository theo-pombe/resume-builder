import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v0";

const api = axios.create({ baseURL: API_BASE_URL });

// Request: attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers)
    config.headers["Authorization"] = `Bearer ${token}`;

  return config;
});

// Response: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
