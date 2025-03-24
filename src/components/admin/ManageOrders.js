import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext"; 

const ManageOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders when component mounts or token changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5289/api/admin/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Update the orders state with fetched data
        setOrders(response.data.$values); // Assuming the orders data is inside $values
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Optional: Poll every 30 seconds to fetch updated orders
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [token]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(`http://localhost:5289/api/admin/orders/${orderId}`, {
        status: status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };  

  // Render the orders list
  return (
    <div>
      <h1>Manage Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders available</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} style={{ marginBottom: '20px' }}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Customer Name:</strong> {order.customerName}</p>
              <p><strong>Order Status:</strong> {order.status}</p>
              
              {/* Render status update buttons */}
              {order.status !== 'Paid' && order.status !== 'Confirmed' && (
                <button onClick={() => updateOrderStatus(order.id, 'Paid')}>Mark as Paid</button>
              )}
              {order.status !== 'Confirmed' && (
                <button onClick={() => updateOrderStatus(order.id, 'Confirmed')}>Confirm Order</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageOrders;
