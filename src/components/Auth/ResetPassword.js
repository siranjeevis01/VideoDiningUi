import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Alert, Spinner, Container, Card } from "react-bootstrap";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage({ type: "danger", text: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("https://localhost:7179/api/users/reset-password-request", { email });
      setMessage({ type: "success", text: response.data.message || "Password reset link sent!" });
    } catch (error) {
      setMessage({ type: "danger", text: error.response?.data?.message || "Failed to send reset link. Try again!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg p-4 rounded-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Reset Password</h2>
          {message.text && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleResetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 rounded-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Send Reset Link"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResetPassword;
