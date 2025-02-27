import React from "react";
import Home from "../components/User/Home";
import FoodList from "../components/User/FoodList";
import OrderHistory from "../components/User/OrderHistory";
import VideoCall from "../components/User/VideoCall";

const UserDashboard = () => {
  return (
    <div>
      <h1>User Dashboard</h1>
      <Home />
      <FoodList />
      <OrderHistory />
      <VideoCall />
    </div>
  );
};

export default UserDashboard;
