import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const navigate = useNavigate();

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
                    <p><strong>Total:</strong> ₹{item.price * item.quantity}</p>
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
          <div className="text-center mt-4">
            <button className="btn btn-success btn-lg" onClick={() => navigate("/checkout")}>
              Proceed to Checkout ✅
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
