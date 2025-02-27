import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, getTotalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container mt-4 text-center">
        <h4>Your cart is empty. Add some items before checkout.</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center">Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm p-3">
            <h4>Order Summary</h4>
            <ul className="list-group">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between">
                  <span>
                    {item.name} ({item.quantity} × ₹{item.price})
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-3">
            <h4>Total Amount: ₹{getTotalAmount()}</h4>
            <button className="btn btn-success w-100 mt-3" onClick={() => navigate("/payment")}>
              Proceed to Payment
            </button>
            <button className="btn btn-secondary w-100 mt-2" onClick={() => navigate("/cart")}>
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
