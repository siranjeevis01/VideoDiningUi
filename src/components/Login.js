import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
      
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Login Response:", response.data);  // ✅ Debugging
  
      if (response.data && response.data.user && response.data.token) {
        login(response.data.user, response.data.token);
        console.log("Stored User:", response.data.user);
        console.log("Stored Token:", response.data.token);
        navigate("/");
      } else {
        alert("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : "Login"}
          </button>
        </form>
        <div className="mt-3 text-center">
          <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
