import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:5289/api/friends";  

const Friends = () => {
  const { user, loading } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/list/${user.id}`);
      console.log("Friends API Response:", response.data);
      setFriends(response.data || []); 
    } catch (error) {
      console.error("Error fetching friends:", error.response?.data || error.message);
      alert("Unable to fetch your friends. Please try again later.");
      setFriends([]);
    }
  };
  
  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests/${user.id}`);
      console.log("Friend Requests API Response:", response.data);
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error.response?.data || error.message);
      alert("Unable to fetch your friend requests. Please try again later.");
      setRequests([]);
    }
  };  

  const sendFriendRequest = async () => {
    if (!user || !user.email) {
      console.error("User is not defined or missing email.");
      return;
    }
    if (!email) {
      console.error("Friend email is required.");
      return;
    }
  
    // Prevent duplicate requests
    const requestAlreadySent = requests.some(req => req.friendEmail === email);
    if (requestAlreadySent) {
      alert("A friend request is already pending!");
      return;
    }
  
    const requestBody = {
      userEmail: user.email,
      friendEmail: email,
    };
    console.log("Sending friend request with data:", requestBody);
  
    try {
      const response = await axios.post(`${API_URL}/add`, requestBody);
      console.log("Friend Request Sent:", response.data);
      setEmail("");
      setShowModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      await axios.post(`${API_URL}/accept`, { requestId });
      fetchFriends();
      fetchRequests();
    } catch (error) {
      console.error("Error accepting request:", error.response?.data || error.message);
    }
  };

  const rejectFriendRequest = async (requestId) => {
    try {
      await axios.post(`${API_URL}/reject`, { requestId });
      fetchRequests();
    } catch (error) {
      console.error("Error rejecting request:", error.response?.data || error.message);
    }
  };

  const removeFriend = async (friendId) => {
    try {
      await axios.delete(`${API_URL}/remove?userId=${user.id}&friendId=${friendId}`);
      fetchFriends();
    } catch (error) {
      console.error("Error removing friend:", error.response?.data || error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view your friends.</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>Friends</h1>

      <button onClick={() => setShowModal(true)}>➕ Add Friend</button>

      {showModal && (
        <div style={modalStyle}>
          <h3>Add Friend</h3>
          <input
            type="email"
            placeholder="Enter friend's email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
          <button onClick={sendFriendRequest}>Send Request</button>
          <button onClick={() => setShowModal(false)}>Close</button>
        </div>
      )}

      <h2>Friend Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        requests.map((req) => (
          <div key={req.id} style={boxStyle}>
            <p>{req.friendEmail} wants to be your friend!</p>
            <button onClick={() => acceptFriendRequest(req.id)}>✅ Accept</button>
            <button onClick={() => rejectFriendRequest(req.id)}>❌ Reject</button>
          </div>
        ))
      )}

      <h2>Your Friends</h2>
      {friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.friendId} style={boxStyle}>
            <p>{friend.name} ({friend.email})</p>
            <button onClick={() => removeFriend(friend.friendId)}>❌ Remove</button>
          </div>
        ))
      ) : (
        <p>No friends yet.</p>
      )}
    </div>
  );
};

// Styles
const modalStyle = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  margin: "10px 0",
};

const boxStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  border: "1px solid #ccc",
  marginBottom: "5px",
};

export default Friends;
