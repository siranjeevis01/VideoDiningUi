import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5289/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("🔗 Request Sent:", config);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log("Response Received:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      console.warn("Token expired, logging out...");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      window.location.reload();
    }

    return Promise.reject(error);
  }
);

export default api;
