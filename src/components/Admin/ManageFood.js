import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Spinner, Alert, Button, Container } from "react-bootstrap";
import Swal from "sweetalert2"; // For delete confirmation

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://localhost:7179/api/foods");
      setFoods(res.data);
    } catch (err) {
      setError("Failed to fetch food items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the food item!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`https://localhost:7179/api/foods/${id}`);
        setFoods(foods.filter((food) => food.id !== id));
        Swal.fire("Deleted!", "The food item has been removed.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete the food item.", "error");
      }
    }
  };

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Manage Foods</h3>

      {loading && <Spinner animation="border" className="d-block mx-auto" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {foods.length > 0 ? (
              foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.id}</td>
                  <td>{food.name}</td>
                  <td>${food.price.toFixed(2)}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(food.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No food items found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Button variant="primary" onClick={fetchFoods} className="mt-3">
        Refresh Foods
      </Button>
    </Container>
  );
};

export default ManageFoods;
