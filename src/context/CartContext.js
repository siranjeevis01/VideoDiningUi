import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
          const storedCart = JSON.parse(localStorage.getItem("cart"));
          return Array.isArray(storedCart) ? storedCart : [];
        } catch {
          return [];
        }
      });      

  useEffect(() => {
    if (Array.isArray(cart)) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);  

  const addToCart = (item) => {
    setCart((prevCart) => {
      if (!Array.isArray(prevCart)) prevCart = []; 
  
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };  

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
