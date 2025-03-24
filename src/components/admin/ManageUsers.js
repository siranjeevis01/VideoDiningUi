import React, { useEffect, useState } from "react";
import api from "../../services/api"; // API service instance
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import * as signalR from "@microsoft/signalr";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        // Initialize SignalR connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5289/adminHub")  
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);

        newConnection
            .start()
            .then(() => {
                console.log("✅ SignalR Connected");
                newConnection.on("userUpdated", (updatedUsers) => {
                    setUsers(updatedUsers);
                });
            })
            .catch((err) => console.error("❌ SignalR Connection Error:", err));

        fetchUsers(); // Fetch initial user data

        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users");
            setUsers(response.data || []);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            alert("User deleted successfully!");
            fetchUsers(); // Refresh user list after deletion
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Manage Users</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ManageUsers;
