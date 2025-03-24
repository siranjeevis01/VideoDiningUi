import axios from "axios";
import { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5289/api/admin/login", {
        email,
        password,
      });
  
      console.log("✅ Login Successful:", response.data);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user info too!
  
      window.location.href = "/admin/dashboard"; // Redirect after login
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      alert("Invalid credentials. Please try again.");
    }
  };  

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
