import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7179/hub")
  .withAutomaticReconnect({
    nextRetryDelayInMilliseconds: (retryCount) => {
      console.warn(`SignalR Reconnect Attempt #${retryCount}`);
      return Math.min(1000 * retryCount, 5000); // Exponential backoff
    },
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const startSignalR = async () => {
  if (connection.state === signalR.HubConnectionState.Connected) {
    console.log("SignalR already connected");
    return;
  }

  try {
    await connection.start();
    console.log("Connected to SignalR");
  } catch (error) {
    console.error("SignalR Connection Error:", error);
    setTimeout(startSignalR, 5000);
  }
};

export const stopSignalR = async () => {
  try {
    if (connection.state === signalR.HubConnectionState.Connected) {
      await connection.stop();
      console.log("SignalR connection stopped");
    }
  } catch (error) {
    console.error("Error stopping SignalR:", error);
  }
};

export const onOrderStatusUpdate = (callback) => {
  connection.on("OrderStatusUpdated", callback);
  return () => connection.off("OrderStatusUpdated", callback); // Cleanup function
};

export const onCartUpdated = (callback) => {
  connection.on("CartUpdated", callback);
  return () => connection.off("CartUpdated", callback);
};

export const onVideoCallStatus = (callback) => {
  connection.on("VideoCallStatus", callback);
  return () => connection.off("VideoCallStatus", callback);
};
