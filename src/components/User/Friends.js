import React, { useState, useEffect } from "react";
import { addFriend, removeFriend } from "../../services/friendService";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7179/api/Friendship/get-friends");
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Failed to load friends list.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async () => {
    if (!newFriendEmail.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      const response = await addFriend(newFriendEmail);
      alert("Friend added successfully!");
      setFriends([...friends, response.data]); // 🔹 Update list without re-fetching
      setNewFriendEmail(""); // Clear input field
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Failed to add friend.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      alert("Friend removed successfully!");
      setFriends(friends.filter((friend) => friend.id !== friendId)); // 🔹 Remove locally
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Friends List</h2>

      {/* Add Friend Section */}
      <div className="row mb-3">
        <div className="col-md-8">
          <input
            type="email"
            className="form-control"
            placeholder="Enter friend's email"
            value={newFriendEmail}
            onChange={(e) => setNewFriendEmail(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100" onClick={handleAddFriend}>
            Add Friend
          </button>
        </div>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center">Loading friends...</p>}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Friends List */}
      {friends.length > 0 ? (
        <ul className="list-group">
          {friends.map((friend) => (
            <li key={friend.id} className="list-group-item d-flex justify-content-between align-items-center">
              {friend.name} ({friend.email})
              <button className="btn btn-danger btn-sm" onClick={() => handleRemoveFriend(friend.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p className="text-center text-muted">No friends added yet.</p>
      )}
    </div>
  );
};

export default Friends;
