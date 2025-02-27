import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:7179/api/cart/${user.id}`)
      .then((res) => res.json())
      .then((data) => setCartItems(data));
  }, [user]);

  const removeItem = async (foodItemId) => {
    await fetch(`https://localhost:7179/api/cart/remove/${user.id}/${foodItemId}`, { method: "DELETE" });
    setCartItems(cartItems.filter(item => item.id !== foodItemId));
  };

  return (
    <div className="container mt-4">
      <h2>Your Cart</h2>
      <ul className="list-group">
        {cartItems.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            {item.name} - ${item.price}
            <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cart;
