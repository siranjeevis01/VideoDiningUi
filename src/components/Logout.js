import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Are you sure you want to logout?</h2>
      <div className="d-flex justify-content-center">
        <button className="btn btn-danger me-3" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Logout;
