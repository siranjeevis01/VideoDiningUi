import React from "react";
import Dashboard from "../components/Admin/Dashboard";
import ManageFoods from "../components/Admin/ManageFood";
import ManageOrders from "../components/Admin/ManageOrders";
import ManageUsers from "../components/Admin/ManageUsers";
import "../styles/Admin.css";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <Dashboard />
      <ManageFoods />
      <ManageOrders />
      <ManageUsers />
    </div>
  );
};

export default AdminDashboard;
