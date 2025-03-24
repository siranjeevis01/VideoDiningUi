import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import { Table, Button, Form, Modal, Alert, Container } from "react-bootstrap";

const ManageFoodMenu = () => {
  const { token } = useContext(AuthContext);
  const [foods, setFoods] = useState([]);
  const [food, setFood] = useState({ name: "", price: "", description: "", imageUrl: "" });
  const [showModal, setShowModal] = useState(false);
  const [editFoodId, setEditFoodId] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await api.get("/admin/foods");
      setFoods(response.data || []);
    } catch (error) {
      console.error("Error fetching food items:", error.response?.data || error);
    }
  };

  const handleAddFood = async () => {
    if (!food.name.trim() || !food.price || food.price <= 0) {
      setAlert({ type: "danger", message: "Please enter a valid name and price!" });
      return;
    }
    
    try {
      const response = await api.post("/admin/foods", { ...food, price: parseFloat(food.price) });
      setFoods([...foods, response.data]);
      setFood({ name: "", price: "", description: "", imageUrl: "" });
      setAlert({ type: "success", message: "Food item added successfully!" });
    } catch (error) {
      console.error("Error adding food:", error.response?.data || error);
    }
  };

  const handleUpdateFood = async () => {
    if (!food.name.trim() || !food.price || food.price <= 0) {
      setAlert({ type: "danger", message: "Please enter a valid name and price!" });
      return;
    }

    try {
      await api.put(`/admin/foods/${editFoodId}`, { ...food, price: parseFloat(food.price) });
      setFoods(foods.map((f) => (f.id === editFoodId ? { ...f, ...food } : f)));
      setFood({ name: "", price: "", description: "", imageUrl: "" });
      setShowModal(false);
      setAlert({ type: "success", message: "Food item updated successfully!" });
    } catch (error) {
      console.error("Error updating food:", error.response?.data || error);
    }
  };

  const handleDeleteFood = async (foodId) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      await api.delete(`/admin/foods/${foodId}`);
      setFoods(foods.filter((food) => food.id !== foodId));
      setAlert({ type: "warning", message: "Food item deleted!" });
    } catch (error) {
      console.error("Error deleting food:", error.response?.data || error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Manage Food Menu</h2>

      {alert && <Alert variant={alert.type}>{alert.message}</Alert>}

      <Form className="mb-4">
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Food Name" value={food.name} onChange={(e) => setFood({ ...food, name: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="number" placeholder="Price" value={food.price} onChange={(e) => setFood({ ...food, price: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Description" value={food.description} onChange={(e) => setFood({ ...food, description: e.target.value })} />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="Image URL" value={food.imageUrl} onChange={(e) => setFood({ ...food, imageUrl: e.target.value })} />
        </Form.Group>
        <Button variant="primary" onClick={handleAddFood} className="w-100">Add Food</Button>
      </Form>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price ($)</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {foods.map((food) => (
            <tr key={food.id}>
              <td><img src={food.imageUrl} alt={food.name} style={{ width: "50px", height: "50px", objectFit: "cover" }} /></td>
              <td>{food.name}</td>
              <td>${food.price.toFixed(2)}</td>
              <td>{food.description}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => { setEditFoodId(food.id); setFood(food); setShowModal(true); }}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDeleteFood(food.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Food Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Food Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Control type="text" placeholder="Food Name" value={food.name} onChange={(e) => setFood({ ...food, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="number" placeholder="Price" value={food.price} onChange={(e) => setFood({ ...food, price: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="text" placeholder="Description" value={food.description} onChange={(e) => setFood({ ...food, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Control type="text" placeholder="Image URL" value={food.imageUrl} onChange={(e) => setFood({ ...food, imageUrl: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleUpdateFood}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageFoodMenu;
