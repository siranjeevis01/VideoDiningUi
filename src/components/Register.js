import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css"; 

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("http://localhost:5289/api/auth/register", formData);
      console.log("API Response:", response); 

      if (response && response.data && response.data.token) {
        login(response.data.user, response.data.token);
        navigate("/");
      } else {
        setError("Unexpected response format from server.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Register</h2>
      {error && <div className="alert alert-danger text-center">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      <div className="text-center mt-3">
        <p>Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
};

export default Register;
