import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:7179/api/orders/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data));
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Order History</h2>
      <ul className="list-group">
        {orders.map(order => (
          <li key={order.id} className="list-group-item">
            Order #{order.id} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderHistory;
