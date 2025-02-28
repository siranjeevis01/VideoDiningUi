import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import Home from "../components/User/Home";
import ResetPassword from "../components/Auth/ResetPassword"; 
import UpdateResetPassword from "../components/Auth/UpdateResetPassword";
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes (Protected) */}
      <Route path="/" element={<PrivateRoute />}>
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/Update-reset-password/:token" element={<UpdateResetPassword />} />
        <Route path="foods" element={<FoodList />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout/:groupOrderID" element={<Checkout />} />
        <Route path="payment" element={<Payment />} /> 
        <Route path="video-call" element={<VideoCall />} />
        <Route path="profile" element={<Profile />} />
        <Route path="friends" element={<Friends />} />
        <Route path="user" element={<UserDashboard />} />
      </Route>

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="food" element={<ManageFood />} />
        <Route path="payments" element={<ManagePayments />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
