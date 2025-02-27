import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useCart } from "../../context/CartContext";

const FoodList = () => {
  const { addToCart } = useCart();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("https://localhost:7179/api/foods");
        if (Array.isArray(response.data)) {
          const formattedFoods = response.data.map((food) => ({
            id: food.Id,
            name: food.Name,
            price: food.Price,
            description: food.Description || "No description available",
            category: food.Category || "Unknown",
            imageUrl: food.ImageUrl || "/images/default-food.jpg",
          }));
          setFoods(formattedFoods);
          setFilteredFoods(formattedFoods);
        } else {
          console.error("Unexpected API response format:", response.data);
          setFoods([]);
          setFilteredFoods([]);
        }
      } catch (error) {
        console.error("Error fetching foods:", error);
        setError("Failed to load food items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Handle search & filter changes
  useEffect(() => {
    setFilteredFoods(
      foods.filter(
        (food) =>
          food.name.toLowerCase().includes(search.toLowerCase()) &&
          (filter === "" || food.category === filter)
      )
    );
  }, [search, filter, foods]);

  if (loading) return <div className="text-center mt-4"><h4>Loading...</h4></div>;
  if (error) return <div className="text-center mt-4"><h4>{error}</h4></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Explore Our Delicious Foods</h2>
      
      {/* Search & Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select className="form-control" onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Categories</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>
        </div>
      </div>

      {/* Food Cards */}
      <div className="row">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div key={food.id} className="col-md-4 mb-4">
              <div className="card food-card h-100 shadow-sm">
                <img
                  src={food.imageUrl}
                  className="card-img-top food-image"
                  alt={food.name}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "/images/default-food.jpg"; 
                  }}
                  loading="lazy"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text">{food.description}</p>
                  <p className="card-text"><strong>Price:</strong> ₹{food.price}</p>
                  <button 
                    className="btn btn-primary w-100 mt-auto" 
                    onClick={() => addToCart(food)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <h5>No foods found.</h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodList;
