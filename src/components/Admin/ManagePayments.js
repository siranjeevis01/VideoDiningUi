import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import { FaUsers, FaUtensils, FaShoppingCart } from "react-icons/fa";

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, orders: 0, foods: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("https://localhost:7179/api/dashboard/stats");
      setStats(response.data);
    } catch (err) {
      setError("Failed to load dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Admin Dashboard</h3>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Row>
          <Col md={4}>
            <Card className="text-center shadow-lg">
              <Card.Body>
                <FaUsers size={40} className="mb-2 text-primary" />
                <Card.Title>{stats.users}</Card.Title>
                <Card.Text>Registered Users</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-lg">
              <Card.Body>
                <FaShoppingCart size={40} className="mb-2 text-success" />
                <Card.Title>{stats.orders}</Card.Title>
                <Card.Text>Total Orders</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="text-center shadow-lg">
              <Card.Body>
                <FaUtensils size={40} className="mb-2 text-warning" />
                <Card.Title>{stats.foods}</Card.Title>
                <Card.Text>Available Foods</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Dashboard;
