import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await axios.post(
        "https://localhost:7179/api/users/login",
        { Email: email, Password: password },
        { withCredentials: true } // Ensure credentials (cookies/tokens) are sent
      );
  
      console.log("Login Response:", response.data);
  
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/");
        window.location.reload();
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Invalid credentials, please try again.");
    }
  };  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
