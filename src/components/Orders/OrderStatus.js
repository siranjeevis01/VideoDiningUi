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

    connection.start()
      .then(() => {
        console.log("Connected to SignalR hub.");
        connection.on("OrderStatusUpdated", (newStatus) => {
          setStatus(newStatus);
        });
      })
      .catch((error) => {
        console.error("Error connecting to SignalR hub:", error);
      });

    // Handle connection loss & attempt reconnection
    connection.onclose(() => {
      console.warn("Connection lost. Attempting to reconnect...");
      setTimeout(() => connection.start().catch(err => console.error("Reconnection failed:", err)), 5000);
    });

    return () => {
      connection.off("OrderStatusUpdated");
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
