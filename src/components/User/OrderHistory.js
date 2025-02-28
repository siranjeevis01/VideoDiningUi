import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      console.warn("No user found in localStorage, redirecting to login.");
      navigate("/login");
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    if (!parsedUser?.token) {
      console.warn("User token missing, redirecting to login.");
      navigate("/login");
      return;
    }

    axios
      .get("https://localhost:7179/api/orders/history", {
        headers: { Authorization: `Bearer ${parsedUser.token}` },
      })
      .then((response) => {
        console.log("Order Data Received:", response.data);

        // Ensure GroupOrderId exists and map data properly
        const formattedOrders = response.data.map((order, index) => ({
          id: order.Id ?? order.id ?? `Unknown-${index}`,
          userId: order.UserId ?? "N/A",
          paymentStatus: order.PaymentStatus ? "Paid" : "Pending",
          groupOrderId: order.GroupOrderId || "N/A",
          foodItems:
            Array.isArray(order.FoodItems) && order.FoodItems.length > 0
              ? order.FoodItems.join(", ")
              : "No items",
          totalAmount: order.TotalAmount ?? 0,
          isDelivered: order.IsDelivered ?? false,
        }));

        setOrders(formattedOrders);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        setError(error.response?.data?.message || "Failed to load order history.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center mt-4">
        <h4>Loading...</h4>
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-4 text-danger">
        <h4>{error}</h4>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Order History</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info text-center">No orders found.</div>
      ) : (
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Group Order ID</th>
              <th>Food Items</th>
              <th>Total Price</th>
              <th>Delivery Status</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.userId}</td>
                <td>{order.groupOrderId}</td>
                <td>{order.foodItems}</td>
                <td>₹{(order.totalAmount ?? 0).toFixed(2)}</td>
                <td>
                  <span className={`badge ${order.isDelivered ? "bg-success" : "bg-warning"}`}>
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </td>
                <td>
                  <span className={`badge ${order.paymentStatus === "Paid" ? "bg-primary" : "bg-danger"}`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;
