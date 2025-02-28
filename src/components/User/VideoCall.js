import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoCall = ({ user }) => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    const fetchCalls = async () => {
      try {
        const res = await axios.get("https://localhost:7179/api/video-calls/active-calls", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setCalls(res.data || []);
      } catch (err) {
        console.error("Error fetching video calls:", err);
        setError("Failed to load video calls.");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user?.token]);

  const handleCallAction = async (id, action) => {
    try {
      await axios.post(`https://localhost:7179/api/video-calls/${action}/${id}`, null, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert(`Call ${action === "accept" ? "Accepted" : "Rejected"}`);
      setCalls((prevCalls) => prevCalls.filter((call) => call.id !== id)); // Remove call from list
    } catch (err) {
      console.error(`Error ${action}ing call:`, err);
      alert(`Failed to ${action} call.`);
    }
  };

  if (loading) return <p>Loading calls...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-3">
      <h2>Video Calls</h2>
      {calls.length === 0 ? (
        <p className="alert alert-info">No active calls</p>
      ) : (
        <ul className="list-group">
          {calls.map((call) => (
            <li key={call.id} className="list-group-item d-flex justify-content-between align-items-center">
              {call.user} is calling...
              <div>
                <button
                  className="btn btn-success me-2"
                  onClick={() => handleCallAction(call.id, "accept")}
                >
                  Accept
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleCallAction(call.id, "reject")}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoCall;
