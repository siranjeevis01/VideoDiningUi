import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const createSignalRConnection = (onCartUpdate) => {
  const connection = new HubConnectionBuilder()
    .withUrl("http://localhost:5289/cartHub")
    .withAutomaticReconnect() // ✅ Auto-reconnect if disconnected
    .configureLogging(LogLevel.Information)
    .build();

  connection
    .start()
    .then(() => console.log("✅ SignalR Connected"))
    .catch((err) => console.error("❌ SignalR Connection Failed:", err));

  connection.on("ReceiveCartUpdate", (updatedCart) => {
    console.log("🔄 Cart updated:", updatedCart);
    onCartUpdate(updatedCart);
  });

  return connection;
};

export const increaseQuantity = async (connection, userId, itemId) => {
  if (connection && connection.state === "Connected") {
    try {
      await connection.invoke("IncreaseQuantity", userId, itemId);
    } catch (err) {
      console.error("❌ Error increasing quantity:", err);
    }
  }
};

export const decreaseQuantity = async (connection, userId, itemId) => {
  if (connection && connection.state === "Connected") {
    try {
      await connection.invoke("DecreaseQuantity", userId, itemId);
    } catch (err) {
      console.error("❌ Error decreasing quantity:", err);
    }
  }
};

export const removeItem = async (connection, userId, itemId) => {
  if (connection && connection.state === "Connected") {
    try {
      await connection.invoke("RemoveItem", userId, itemId);
    } catch (err) {
      console.error("❌ Error removing item:", err);
    }
  }
};
