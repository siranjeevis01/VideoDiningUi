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
        setOrders(Array.isArray(response.data) ? response.data : []);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
        setError("Failed to load order history.");
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
              <th>Food Items</th>
              <th>Total Price</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id ?? order.Id ?? index}>
                <td>{order.id ?? order.Id ?? "N/A"}</td>
                <td>{Array.isArray(order.FoodItems) ? order.FoodItems.join(", ") : "N/A"}</td>
                <td>₹{order.TotalAmount ?? 0}</td>
                <td>
                  <span
                    className={`badge ${
                      order.IsDelivered ? "bg-success" : "bg-warning"
                    }`}
                  >
                    {order.IsDelivered ? "Delivered" : "Pending"}
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
