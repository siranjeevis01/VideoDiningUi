import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    console.log("📦 Stored User:", storedUser);
    console.log("🔑 Stored Token:", storedToken);
  
    if (!storedToken || !storedUser) {
      console.warn("⚠️ No user or token found in local storage.");
      setLoading(false);
      return;
    }
  
    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    setToken(storedToken);
  
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found.");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5289/api/auth/verify",{
          headers: { Authorization: `Bearer ${token}` }, 
        });
  
        if (response.data?.valid) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          console.log("✅ User Verified:", parsedUser);
        } else {
          console.warn("⏳ Token expired. Logging out...");
          logout();
        }
      } catch (error) {
        console.error("❌ Error verifying user:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };
  
    verifyUser();
  }, []);  

  const login = (userData, token) => {
    try {
      if (!token) {
        console.error("Token is missing during login.");
        return;
      }
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(userData);
      setToken(token);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const logout = () => {
    console.log("Logging out user...");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
    console.log("Logged out successfully");
  };

  return loading ? (
    <div>Loading...</div> 
  ) : (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
  
};
