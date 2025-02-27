import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoCall = ({ user }) => {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    if (user) {
      axios.get("https://localhost:7179/api/video-calls/active-calls").then((res) => setCalls(res.data));
    }
  }, [user]);

  const acceptCall = async (id) => {
    await axios.post(`https://localhost:7179/api/video-calls/accept/${id}`);
    alert("Call Accepted");
  };

  const rejectCall = async (id) => {
    await axios.post(`https://localhost:7179/api/video-calls/reject/${id}`);
    alert("Call Rejected");
  };

  return (
    <div>
      <h2>Video Calls</h2>
      {calls.length === 0 ? <p>No active calls</p> : (
        <ul>
          {calls.map((call) => (
            <li key={call.id}>
              {call.user} is calling...
              <button onClick={() => acceptCall(call.id)}>Accept</button>
              <button onClick={() => rejectCall(call.id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoCall;
