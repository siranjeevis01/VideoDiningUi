import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Container, Button } from "react-bootstrap";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:7179/api/users");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-3">Manage Users</h2>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Button variant="primary" onClick={fetchUsers} className="mt-3">
        Refresh Users
      </Button>
    </Container>
  );
};

export default ManageUsers;
