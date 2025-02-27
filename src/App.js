import React from "react";
import Navbar from "./components/Layout/Navbar";
import AppRoutes from "./routes/AppRoutes"; 
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import "./styles.css";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
