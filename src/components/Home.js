import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";

const Home = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (loading) {
      document.body.style.backgroundColor = "#1c1c1c"; // Dark background when loading
    } else {
      document.body.style.backgroundColor = "#121212"; // Futuristic dark mode
    }
  }, [loading]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLoggingOut(false);
      navigate("/login");
    } catch (error) {
      setIsLoggingOut(false);
      console.error("Logout Error: ", error);
    }
  };

  return (
    <div className="home-container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h2 className="mb-4 text-light">Welcome, {user ? user.name : "Guest"}!</h2>

        {loading ? (
          <div className="loading-state">
            <Spinner animation="border" variant="light" />
            <p className="text-light">Loading...</p>
          </div>
        ) : user ? (
          <>
            <div className="d-grid gap-3 mb-3">
              <button
                className="btn futuristic-btn"
                onClick={() => navigate("/friends")}
              >
                Add Friends
              </button>
              <button
                className="btn futuristic-btn"
                onClick={() => navigate("/foods")}
              >
                Explore Food Menu
              </button>
              <button
                className="btn futuristic-btn"
                onClick={() => navigate("/orders")}
              >
                Your Orders
              </button>
            </div>
            <button
              className="btn btn-danger btn-lg"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-primary mb-3 btn-lg"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <p className="text-light">
              Don't have an account?{" "}
              <a href="/signup" className="link-light">
                Sign up here
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

// const styles = `

// /* Background Gradient for Futuristic Feel */
// .home-container {
//   background: linear-gradient(135deg, #1e2a47, #1c1c1c);
//   color: #fff;
//   transition: background 0.3s ease;
//   text-align: center;
//   font-family: 'Roboto', sans-serif;
// }

// h2 {
//   font-size: 2.5rem;
//   font-weight: bold;
//   text-transform: uppercase;
//   letter-spacing: 1px;
//   text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
// }

// .futuristic-btn {
//   background-color: #0d6efd;
//   border: 2px solid #0d6efd;
//   color: white;
//   font-size: 1.2rem;
//   padding: 12px 30px;
//   border-radius: 30px;
//   transition: all 0.3s ease;
//   box-shadow: 0px 10px 30px rgba(13, 110, 253, 0.5);
// }

// .futuristic-btn:hover {
//   background-color: #004085;
//   border-color: #004085;
//   box-shadow: 0px 10px 50px rgba(13, 110, 253, 0.8);
// }

// .text-light {
//   color: #f8f9fa;
// }

// .link-light {
//   color: #0d6efd;
//   text-decoration: none;
// }

// .link-light:hover {
//   color: #004085;
//   text-decoration: underline;
// }

// /* Loading State */
// .loading-state {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
// }

// .loading-state p {
//   margin-top: 10px;
//   color: #f8f9fa;
//   font-size: 1.1rem;
// }

// /* Logout Button Style */
// .btn-danger {
//   background-color: #ff4d4f;
//   border: 2px solid #ff4d4f;
//   font-size: 1.1rem;
//   padding: 12px 30px;
//   border-radius: 30px;
//   box-shadow: 0px 10px 30px rgba(255, 77, 79, 0.5);
//   transition: all 0.3s ease;
// }

// .btn-danger:hover {
//   background-color: #d63333;
//   border-color: #d63333;
//   box-shadow: 0px 10px 50px rgba(255, 77, 79, 0.8);
// }

// .btn-lg {
//   padding: 15px 35px;
//   font-size: 1.2rem;
// }

// `;


// const styleSheet = document.createElement("style");
// styleSheet.type = "text/css";
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);