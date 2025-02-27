import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import * as signalR from "@microsoft/signalr";

const OrderStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("Pending");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7179/orders-hub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.on("OrderStatusUpdated", (newStatus) => {
        setStatus(newStatus);
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="alert alert-info">
      Order Status: <strong>{status}</strong>
    </div>
  );
};

export default OrderStatus;
