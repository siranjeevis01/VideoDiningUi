import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Friends from "./components/Friends";
import FoodMenu from "./components/FoodMenu";
import Cart from "./components/Cart";
import Payment from "./components/Payment";
import Orders from "./components/Orders";
import VideoCall from "./components/VideoCall";
import Logout from "./components/Logout";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import ManageFoodMenu from "./components/admin/ManageFoodMenu";
import ManageOrders from "./components/admin/ManageOrders";
import ManagePayments from "./components/admin/ManagePayments";

const App = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/foods" element={<FoodMenu />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} /> 
          <Route path="/orders/:orderId" element={<Orders />} />
          <Route path="/videoCallHub/:orderId" element={<VideoCall user={currentUser} />} />
          <Route path="/logout" element={<Logout />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/foods" element={<ManageFoodMenu />} />
          <Route path="/admin/orders" element={<ManageOrders />} />
          <Route path="/admin/payments" element={<ManagePayments />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;




// import { Navigate } from "react-router-dom";
// import { useContext } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AuthProvider, AuthContext } from "./context/AuthContext";
// import Navbar from "./components/Navbar";
// import Register from "./components/Register";
// import Login from "./components/Login";
// import Home from "./components/Home";
// import Friends from "./components/Friends";
// import FoodMenu from "./components/FoodMenu";
// import Cart from "./components/Cart";
// import Payment from "./components/Payment";
// import Orders from "./components/Orders";
// import VideoCall from "./components/VideoCall";
// import Logout from "./components/Logout";
// import AdminLogin from "./components/AdminLogin";

// // Admin Components
// import AdminDashboard from "./components/admin/AdminDashboard";
// import ManageUsers from "./components/admin/ManageUsers";
// import ManageFoodMenu from "./components/admin/ManageFoodMenu";
// import ManageOrders from "./components/admin/ManageOrders";
// import ManagePayments from "./components/admin/ManagePayments";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Navbar />
//         <Routes>
//           {/* User Routes */}
//           <Route path="/" element={<Home />} />
//           <Route path="/home" element={<Home />} />
//           <Route path="/signup" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/AdminLogin" element={<AdminLogin />} />
//           <Route path="/friends" element={<Friends />} />
//           <Route path="/foods" element={<FoodMenu />} />
//           <Route path="/cart" element={<Cart />} />
//           <Route path="/payment" element={<Payment />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/orders/:orderId" element={<Orders />} />
//           <Route path="/videoCallHub/:orderId" element={<VideoCall />} />
//           <Route path="/logout" element={<Logout />} />

//           {/* Admin Routes (Protected) */}
//           <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//           <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
//           <Route path="/admin/foods" element={<AdminRoute><ManageFoodMenu /></AdminRoute>} />
//           <Route path="/admin/orders" element={<AdminRoute><ManageOrders /></AdminRoute>} />
//           <Route path="/admin/payments" element={<AdminRoute><ManagePayments /></AdminRoute>} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// // ✅ Protect Admin Routes
// const AdminRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user?.isAdmin ? children : <Navigate to="/" />;
// };

// export default App;
