import axios from "axios";

const API_BASE_URL = "http://localhost:7179/api";

// Create an axios instance with default settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Food API Calls
export const getFoods = async () => api.get("/foods");
export const getFoodById = async (id) => api.get(`/foods/${id}`);
export const addFood = async (food) => api.post("/foods", food);
export const updateFood = async (id, food) => api.put(`/foods/${id}`, food);
export const deleteFood = async (id) => api.delete(`/foods/${id}`);

// User Authentication
export const registerUser = async (userData) => api.post("/users/register", userData);
export const loginUser = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("authToken", response.data.token);
  }
  return response;
};
export const getUserById = async (userId) => api.get(`/users/${userId}`);
export const updateUser = async (userId, userData) => api.put(`/users/update/${userId}`, userData);

// Order Management
export const placeOrder = async (order) => api.post("/orders", order);
export const confirmDelivery = async () => api.get("/orders/confirm-delivery");
export const getUserOrders = async (userId) => api.get(`/orders/user/${userId}`);
export const updateOrderStatus = async (orderId, status) => api.put(`/orders/update-status/${orderId}`, { status });

// Video Call Management
export const requestVideoCall = async () => api.post("/video-calls/request");
export const acceptVideoCall = async (id) => api.post(`/video-calls/accept/${id}`);
export const rejectVideoCall = async (id) => api.post(`/video-calls/reject/${id}`);
export const endVideoCall = async (id) => api.post(`/video-calls/end/${id}`);

export default api;
