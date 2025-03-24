import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUsers, FaUtensils, FaClipboardList, FaMoneyBillWave } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar">
          <div className="position-sticky pt-3">
            <h4 className="text-white text-center">Admin Panel</h4>
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin/users">
                  <FaUsers className="me-2" /> Manage Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin/foods">
                  <FaUtensils className="me-2" /> Manage Food Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin/orders">
                  <FaClipboardList className="me-2" /> Manage Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/admin/payments">
                  <FaMoneyBillWave className="me-2" /> Manage Payments
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <h2 className="mt-3 mb-4">Admin Dashboard</h2>

          {/* Dashboard Cards */}
          <div className="row">
            <div className="col-md-6 col-lg-3">
              <div className="card bg-primary text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Users</h5>
                  <p className="card-text display-6">245</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card bg-success text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="card-text display-6">128</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card bg-warning text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Food Items</h5>
                  <p className="card-text display-6">58</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card bg-danger text-white shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Payments</h5>
                  <p className="card-text display-6">$14,230</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table Placeholder */}
          <div className="mt-4">
            <h4>Recent Orders</h4>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Food Item</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#1001</td>
                  <td>John Doe</td>
                  <td>Pizza</td>
                  <td><span className="badge bg-success">Delivered</span></td>
                  <td>$12</td>
                </tr>
                <tr>
                  <td>#1002</td>
                  <td>Jane Smith</td>
                  <td>Burger</td>
                  <td><span className="badge bg-warning">Pending</span></td>
                  <td>$8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
