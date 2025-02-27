import axios from "axios";

const API_URL = "https://localhost:7179/api/friends";

export const addFriend = async (userId, friendId) => {
  try {
    const response = await axios.post(`${API_URL}/add`, { userId, friendId });
    return response.data;
  } catch (error) {
    console.error("Error adding friend:", error);
    throw error;
  }
};

export const getFriends = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends list:", error);
    throw error;
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    await axios.delete(`${API_URL}/remove`, { data: { userId, friendId } });
  } catch (error) {
    console.error("Error removing friend:", error);
    throw error;
  }
};

export const blockUser = async (userId, blockedUserId) => {
  try {
    await axios.post(`${API_URL}/block`, { userId, blockedUserId });
  } catch (error) {
    console.error("Error blocking user:", error);
    throw error;
  }
};

export const unblockUser = async (userId, blockedUserId) => {
  try {
    await axios.post(`${API_URL}/unblock`, { userId, blockedUserId });
  } catch (error) {
    console.error("Error unblocking user:", error);
    throw error;
  }
};
