import React, { useState } from "react";

const VideoCall = () => {
  const [friendId, setFriendId] = useState("");

  const startCall = async () => {
    const response = await fetch("https://localhost:7179/api/video-calls/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ friendId }),
    });

    if (response.ok) {
      alert("Call request sent!");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Start a Video Call</h2>
      <input type="text" className="form-control mb-2" placeholder="Friend ID" value={friendId} onChange={(e) => setFriendId(e.target.value)} />
      <button className="btn btn-success w-100" onClick={startCall}>Call</button>
    </div>
  );
};

export default VideoCall;
