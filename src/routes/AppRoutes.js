import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../components/User/Home";
import FoodList from "../components/User/FoodList";
import OrderHistory from "../components/User/OrderHistory";
import VideoCall from "../components/User/VideoCall";
import Cart from "../components/User/Cart";
import Checkout from "../components/User/Checkout";
import Payment from "../components/User/Payment"; 
import Profile from "../components/User/Profile";
import Friends from "../components/User/Friends";
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import UserDashboard from "../components/UserDashboard";  
import AdminDashboard from "../components/Admin/AdminDashboard"; 
import ManageUsers from "../components/Admin/ManageUsers";  
import ManageOrders from "../components/Admin/ManageOrders"; 
import ManageFood from "../components/Admin/ManageFood";  
import ManagePayments from "../components/Admin/ManagePayments"; 

import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes (Protected) */}
      <Route path="/foods" element={<PrivateRoute element={<FoodList />} />} />
      <Route path="/orders" element={<PrivateRoute element={<OrderHistory />} />} />
      <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
      <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />
      <Route path="/payment" element={<PrivateRoute element={<Payment />} />} /> 
      <Route path="/video-call" element={<PrivateRoute element={<VideoCall />} />} />
      <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
      <Route path="/friends" element={<PrivateRoute element={<Friends />} />} />
      <Route path="/user" element={<PrivateRoute element={<UserDashboard />} />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />
      <Route path="/admin/orders" element={<AdminRoute element={<ManageOrders />} />} />
      <Route path="/admin/food" element={<AdminRoute element={<ManageFood />} />} />
      <Route path="/admin/payments" element={<AdminRoute element={<ManagePayments />} />} />
    </Routes>
  );
};

export default AppRoutes;
