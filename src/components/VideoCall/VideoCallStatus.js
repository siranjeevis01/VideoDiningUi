import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const VideoCallStatus = () => {
  const [callStatus, setCallStatus] = useState("Waiting for response...");

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7179/video-call-hub")
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => {
      connection.on("CallStatusUpdated", (status) => {
        setCallStatus(status);
      });
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div className="alert alert-primary">
      Video Call Status: <strong>{callStatus}</strong>
    </div>
  );
};

export default VideoCallStatus;
