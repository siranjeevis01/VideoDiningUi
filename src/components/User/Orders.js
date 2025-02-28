import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [groupOrderID, setGroupOrderID] = useState(null);

  useEffect(() => {
    if (user) {
      // 🔹 First, fetch the GroupOrderID for the user
      axios.get(`https://localhost:7179/api/orders/group/${user.id}`)
        .then((res) => {
          if (res.data && res.data.groupOrderID) {
            setGroupOrderID(res.data.groupOrderID);

            // 🔹 Then, fetch orders using GroupOrderID
            return axios.get(`https://localhost:7179/api/orders/${res.data.groupOrderID}`);
          }
        })
        .then((res) => {
          if (res) setOrders(res.data);
        })
        .catch((error) => console.error("Error fetching orders:", error));
    }
  }, [user]);

  return (
    <div>
      <h2>Order History</h2>
      <p>Group Order ID: {groupOrderID || "Not Found"}</p>
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
