import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = (onCartUpdate) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5289/cartHub")
    .withAutomaticReconnect()
    .build();

  connection.start()
    .then(() => console.log("Connected to SignalR CartHub"))
    .catch(err => console.error("Error connecting to CartHub:", err));

  connection.on("ReceiveCartUpdate", (updatedCart) => {
    console.log("Received cart update:", updatedCart);
    onCartUpdate(updatedCart);
  });

  return connection;
};
