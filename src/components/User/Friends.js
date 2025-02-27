import React, { useState, useEffect } from "react";
import { addFriend, removeFriend } from "../../services/friendService";
import axios from "axios";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendEmail, setNewFriendEmail] = useState("");

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get("https://localhost:7179/api/Friendship/get-friends");
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const handleAddFriend = async () => {
    if (!newFriendEmail) {
      alert("Please enter an email.");
      return;
    }

    try {
      await addFriend(newFriendEmail);
      alert("Friend added successfully!");
      fetchFriends(); // Refresh the friend list
    } catch (error) {
      console.error("Error adding friend:", error);
      alert("Failed to add friend.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      await removeFriend(friendId);
      alert("Friend removed successfully!");
      fetchFriends(); // Refresh the friend list
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend.");
    }
  };

  return (
    <div>
      <h2>Friends List</h2>
      <input
        type="email"
        placeholder="Enter friend's email"
        value={newFriendEmail}
        onChange={(e) => setNewFriendEmail(e.target.value)}
      />
      <button onClick={handleAddFriend}>Add Friend</button>

      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.name} ({friend.email})
            <button onClick={() => handleRemoveFriend(friend.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Friends;
