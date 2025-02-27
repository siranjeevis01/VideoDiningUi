import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get(`https://localhost:7179/api/orders/user/${user.id}`).then((res) => setOrders(res.data));
    }
  }, [user]);

  return (
    <div>
      <h2>Order History</h2>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              {order.foodName} - {order.status} - ${order.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
