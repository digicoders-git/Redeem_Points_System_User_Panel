import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export default api;
