import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert, Container, Badge } from "react-bootstrap";
import { startSignalR, onOrderStatusUpdate } from "../../services/signalrService";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
    startSignalR(); // Start SignalR connection

    onOrderStatusUpdate((updatedOrder) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://localhost:7179/api/orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`https://localhost:7179/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map((order) => 
        order.id === id ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      alert("Failed to update order status!");
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Manage Orders</h3>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <Badge bg={order.status === "Pending" ? "warning" : "success"}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    {order.status === "Pending" && (
                      <Button variant="success" onClick={() => handleUpdateStatus(order.id, "Completed")}>
                        Mark as Completed
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Button variant="primary" onClick={fetchOrders} className="mt-3">
        Refresh Orders
      </Button>
    </Container>
  );
};

export default ManageOrders;
