import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Optimize cart count calculation
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  // Close navbar when clicking a link (mobile fix)
  const handleNavLinkClick = () => setIsNavOpen(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
          Video Dining
        </Link>

        {/* Navbar Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          onClick={() => setIsNavOpen(!isNavOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className={`collapse navbar-collapse ${isNavOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavLinkClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/foods" onClick={handleNavLinkClick}>
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders" onClick={handleNavLinkClick}>
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart" onClick={handleNavLinkClick}>
                Cart 🛒 {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
              </Link>
            </li>

            {user ? (
              <>
                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard" onClick={handleNavLinkClick}>
                      Admin
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={handleNavLinkClick}>
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => { logout(); handleNavLinkClick(); }}>
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleNavLinkClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleNavLinkClick}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
