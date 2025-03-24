import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const createOrderConnection = (onOrderUpdate, onVideoCallInvite) => {
  const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5289/orderHub") // Ensure correct backend URL
    .withAutomaticReconnect()
    .configureLogging(LogLevel.Information)
    .build();

  connection
    .start()
    .then(() => console.log("✅ SignalR Connected for Orders"))
    .catch((err) => console.error("❌ Order SignalR Connection Failed:", err));

  connection.on("OrderUpdated", (orderData) => {
    console.log("🔄 Order updated:", orderData);
    onOrderUpdate(orderData);
  });

  connection.on("StartVideoCall", (orderId) => {
    console.log("📞 Video call invite received for order:", orderId);
    onVideoCallInvite(orderId);
  });

  return connection;
};
