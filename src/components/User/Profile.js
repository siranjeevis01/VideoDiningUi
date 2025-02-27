import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner, Form, Button, Alert, Card, Container } from "react-bootstrap";
import "../../styles/Profile.css";

const Profile = ({ user }) => {
  const [profileData, setProfileData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      setProfileData(user);
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ type: "danger", text: "Please log in to view your profile." });
        return;
      }
  
      const response = await axios.get("https://localhost:7179/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
  
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
      setMessage({ type: "danger", text: "Unauthorized or session expired. Please log in again." });
      localStorage.removeItem("token"); 
    } finally {
      setLoading(false);
    }
  };  

  const handleChange = (e) => {
    setProfileData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
          avatar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profileData || !profileData.name || !profileData.email) {
      setMessage({ type: "danger", text: "Name and email cannot be empty!" });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("id", profileData.id); 
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("phoneNumber", profileData.phoneNumber || "");
    formData.append("newPassword", profileData.newPassword || "");
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await axios.put("https://localhost:7179/api/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage({ type: "success", text: "Profile updated successfully!" });
      console.log("Profile Update Response:", response.data);
    } catch (error) {
      setMessage({ type: "danger", text: "Update failed. Try again later." });
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body className="text-center">
            <h2>Loading profile...</h2>
            <Spinner animation="border" />
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
          <Card.Body className="text-center">
            <h2>User not found</h2>
            <p>Please log in to update your profile.</p>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Update Profile</h2>
          {message.text && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <div className="text-center mb-3">
              <img
                src={profileData.avatar || "/default-avatar.png"}
                alt="Profile Preview"
                className="rounded-circle border shadow-sm"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={profileData?.name || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={profileData?.email || ""} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 rounded-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Update Profile"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
