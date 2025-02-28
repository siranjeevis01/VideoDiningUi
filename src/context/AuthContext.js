import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user && user.token) {
      const tokenExpiry = JSON.parse(atob(user.token.split(".")[1])).exp * 1000;
      const now = Date.now();

      if (tokenExpiry <= now) {
        logout();
      }
    }
  }, [user]); // Check token expiry when user state changes

  const login = async (credentials) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Allow error handling in components
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
