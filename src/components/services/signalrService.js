import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7179/hub") 
  .withAutomaticReconnect()
  .build();

export const startSignalR = async () => {
  try {
    await connection.start();
    console.log("Connected to SignalR");
  } catch (error) {
    console.error("SignalR Connection Error:", error);
    setTimeout(startSignalR, 5000); 
  }
};

export const onOrderStatusUpdate = (callback) => {
  connection.on("OrderStatusUpdated", (order) => {
    callback(order);
  });
};

export const onCartUpdated = (callback) => {
  connection.on("CartUpdated", (cart) => {
    callback(cart);
  });
};

export const onVideoCallStatus = (callback) => {
  connection.on("VideoCallStatus", (callStatus) => {
    callback(callStatus);
  });
};
