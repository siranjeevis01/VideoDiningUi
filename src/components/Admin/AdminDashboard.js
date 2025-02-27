import React from "react";
import ManageFood from "./ManageFood";  
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers"; 
import ManagePayments from "./ManagePayments"; 
import "../../styles/Admin.css"; // 

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <ManageUsers />
      <ManageOrders />
      <ManageFood />
      <ManagePayments />
    </div>
  );
};

export default AdminDashboard;
