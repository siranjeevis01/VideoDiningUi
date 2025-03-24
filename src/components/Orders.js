import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Orders.css"; // Custom CSS for extra styles

const Orders = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5289/api/orders");
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d) ? "TBD" : d.toLocaleString();
  };

  const handleSendReminder = async (orderId) => {
    try {
      const response = await axios.post(`http://localhost:5289/api/orders/remind/${orderId}`);
      alert("Reminder sent successfully!");
    } catch (error) {
      alert("Failed to send reminder.");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:5289/api/orders/cancel/${orderId}/${userId}`);
      setOrders((prevOrders) => prevOrders.filter(order => order.orderId !== orderId));
      alert(response.data.message);
    } catch (error) {
      alert("Failed to cancel order.");
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const response = await axios.post(`http://localhost:5289/api/orders/mark-delivered/${orderId}/${userId}`);
      alert("Order delivered successfully!");
    } catch (error) {
      alert("Failed to mark order as delivered.");
    }
  };

  const handleJoinVideoCall = (orderId) => {
    navigate(`/videoCallHub/${orderId}`);
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Your Orders</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={order.orderId || index} className="col-lg-6 col-md-6 col-sm-12 mb-4">
              <div className="card shadow-sm border-0 rounded-3 order-card">
                <div className="card-body">
                  <h5 className="card-title text-primary">Order ID: {order.orderId}</h5>
                  <p className={`badge ${order.status === "Delivered" ? "bg-success" : "bg-warning"} status-badge`}>
                    {order.status}
                  </p>

                  <div className="mb-3">
                    <h6>Friends Payment Status:</h6>
                    {order.orderPayments?.length > 0 ? (
                      order.orderPayments.map((payment, idx) => (
                        <div key={idx} className="d-flex justify-content-between align-items-center border-bottom py-1">
                          <span>{payment.userEmail || "No email provided"}</span>
                          <span className={payment.isPaid ? "text-success" : "text-danger"}>
                            {payment.isPaid ? "✅ Paid" : "❌ Unpaid"}
                          </span>
                          <span>${payment.amountPaid}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No payment status found.</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <h6>Order Items:</h6>
                    {order.orderItems?.length > 0 ? (
                      order.orderItems.map((item, idx) => (
                        <div key={idx} className="border-bottom py-1">
                          <p className="mb-1 fw-semibold">{item.foodItemName}</p>
                          <small>Quantity: {item.quantity} | Price: ${item.price}</small>
                          <p className="text-muted">{item.description || "No description available"}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted">No items found.</p>
                    )}
                  </div>

                  <p><strong>Expected Delivery:</strong> {formatDate(order.expectedDelivery)}</p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleSendReminder(order.orderId)}>
                      🔔 Send Reminder
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancelOrder(order.orderId)}>
                      ❌ Cancel Order
                    </button>
                    {order.status !== "Delivered" && order.status !== "Cancelled" && (
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleMarkDelivered(order.orderId)}>
                        ✅ Mark as Delivered
                      </button>
                    )}
                    {order.status === "Delivered" && (
                      <button className="btn btn-outline-dark btn-sm" onClick={() => handleJoinVideoCall(order.orderId)}>
                        🎥 Join Video Call
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
