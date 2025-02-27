// src/routes/AdminRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = ({ element }) => {
  const { user } = useAuth();
  return user && user.role === "admin" ? element : <Navigate to="/" />;
};

export default AdminRoute;
