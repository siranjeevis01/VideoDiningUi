import React from "react";
import ManageFood from "./ManageFood";  // ✅ Corrected import
import ManageOrders from "./ManageOrders";
import ManageUsers from "./ManageUsers";
import ManagePayments from "./ManagePayments";
import "../../styles/Admin.css"; 
import { Tab, Nav, Container } from "react-bootstrap";
import { FaUsers, FaShoppingCart, FaUtensils, FaCreditCard } from "react-icons/fa";

const AdminDashboard = () => {
  return (
    <Container className="mt-4 admin-container">
      <h2 className="mb-4 text-center">Admin Dashboard</h2>

      <Tab.Container defaultActiveKey="users">
        <Nav variant="tabs" className="justify-content-center">
          <Nav.Item>
            <Nav.Link eventKey="users">
              <FaUsers className="me-2" /> Users
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="orders">
              <FaShoppingCart className="me-2" /> Orders
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="foods">
              <FaUtensils className="me-2" /> Foods
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="payments">
              <FaCreditCard className="me-2" /> Payments
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="users">
            <ManageUsers />
          </Tab.Pane>
          <Tab.Pane eventKey="orders">
            <ManageOrders />
          </Tab.Pane>
          <Tab.Pane eventKey="foods">
            <ManageFood /> {/* ✅ Corrected reference */}
          </Tab.Pane>
          <Tab.Pane eventKey="payments">
            <ManagePayments />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
