import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const { cart } = useContext(CartContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Video Dining
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/friends">
                Friends
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/foods">
                Food Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart ({cart.length})
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/logout">
                Logout
              </Link>
            </li>

            {/* Admin Panel */}
            <li className="nav-item">
              <Link className="nav-link text-danger fw-bold" to="/admin/dashboard">
                Admin Panel
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { CartContext } from "../context/CartContext";
// import { AuthContext } from "../context/AuthContext";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Navbar = () => {
//   const { cart } = useContext(CartContext);
//   const { user, logout } = useContext(AuthContext);
//   const isAdmin = user?.isAdmin || false;

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Video Dining
//         </Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             {isAdmin ? (
//               // ✅ Admin Navigation
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/dashboard">
//                     Dashboard
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/users">
//                     Manage Users
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/foods">
//                     Manage Food Menu
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/orders">
//                     Manage Orders
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/admin/payments">
//                     Manage Payments
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <button className="btn btn-outline-light nav-link" onClick={logout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               // ✅ Normal User Navigation
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/">
//                     Home
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/friends">
//                     Friends
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/foods">
//                     Food Menu
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/cart">
//                     Cart ({cart.length})
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/orders">
//                     Orders
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/AdminLogin">
//                     Admin Login
//                   </Link>
//                 </li>
//                 {user ? (
//                   <>
//                     <li className="nav-item">
//                       <button className="btn btn-outline-light nav-link" onClick={logout}>
//                         Logout
//                       </button>
//                     </li>
//                     {/* ✅ Show Admin Panel Link for Admin Users */}
//                     {isAdmin && (
//                       <li className="nav-item">
//                         <Link className="btn btn-danger nav-link text-white fw-bold" to="/admin/dashboard">
//                           Admin Panel
//                         </Link>
//                       </li>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     <li className="nav-item">
//                       <Link className="nav-link" to="/login">
//                         Login
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link className="nav-link" to="/signup">
//                         Sign Up
//                       </Link>
//                     </li>
//                   </>
//                 )}
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
