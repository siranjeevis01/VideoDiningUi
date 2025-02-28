import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [groupOrderID, setGroupOrderID] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setError("User not found. Please log in.");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser || !parsedUser.userId) {
        throw new Error("Invalid user data!");
      }

      setUser(parsedUser);

      axios.get(`https://localhost:7179/api/orders/group/${parsedUser.userId}`)
        .then(res => {
          if (res.data?.groupOrderId) {
            setGroupOrderID(res.data.groupOrderId);
          } else {
            setError("Group Order ID is missing! Try refreshing.");
          }
        })
        .catch(() => {
          setError("Failed to fetch Group Order ID.");
        });

    } catch (err) {
      setError("Invalid user data. Please log in again.");
      localStorage.removeItem("user");
    }
  }, []);

  const handleCheckout = () => {
    if (!groupOrderID) {
      alert("Group Order ID is missing! Cannot proceed to checkout.");
      return;
    }
    navigate(`/checkout/${groupOrderID}`);
  };  

  return (
    <div className="container mt-4">
      <h2 className="text-center">Your Cart 🛒</h2>
      {cart.length === 0 ? (
        <h5 className="text-center text-danger mt-4">Your cart is empty.</h5>
      ) : (
        <>
          <div className="row">
            {cart.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card h-100 shadow-sm">
                  <img src={item.imageUrl} className="card-img-top" alt={item.name} />
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Total:</strong> ₹{(item.price * item.quantity).toFixed(2)}</p>
                    <div className="btn-group w-100">
                      <button className="btn btn-sm btn-secondary" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity <= 1}>-</button>
                      <span className="btn btn-sm btn-light">{item.quantity}</span>
                      <button className="btn btn-sm btn-secondary" onClick={() => increaseQuantity(item.id)}>+</button>
                    </div>
                    <button className="btn btn-danger w-100 mt-2" onClick={() => removeFromCart(item.id)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h4>Total: ₹{cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h4>
            <button 
              className="btn btn-success" 
              onClick={handleCheckout} 
              disabled={!groupOrderID}
            >
              Proceed to Checkout
            </button>
          </div>

          {!groupOrderID && (
            <button className="btn btn-warning mt-3" onClick={() => window.location.reload()}>
              Retry Fetching Group Order ID
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
