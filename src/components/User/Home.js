import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";

const Home = () => {
  const [foods, setFoods] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("https://localhost:7179/api/foods")
      .then(response => {
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setFoods(response.data); // Directly store response data
        } else {
          console.error("Unexpected API response format:", response.data);
          setFoods([]);
        }
      })
      .catch(error => {
        console.error("Error fetching food items:", error);
        setError("Failed to load food items.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Format food data using useMemo to prevent unnecessary re-renders
  const formattedFoods = useMemo(() => {
    return foods.map(food => ({
      id: food.Id,
      name: food.Name,
      price: food.Price,
      description: food.Description || "No description available",
      imageUrl: food.ImageUrl || "/images/default-food.jpg"
    }));
  }, [foods]);

  if (loading) return <div className="text-center mt-4"><h4>Loading...</h4></div>;
  if (error) return <div className="text-center mt-4"><h4>{error}</h4></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Welcome to Video Dining App</h2>
      {formattedFoods.length === 0 ? (
        <div className="text-center"><h5>No food items available.</h5></div>
      ) : (
        <div className="row d-flex justify-content-center">
          {formattedFoods.map((food, index) => (
            <div key={food.id || index} className="col-md-4 d-flex align-items-stretch mb-3">
              <div className="card w-100 food-card">
                <img 
                  src={food.imageUrl} 
                  className="card-img-top food-image" 
                  alt={food.name} 
                  onError={(e) => (e.target.src = "/images/default-food.jpg")} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text flex-grow-1">{food.description}</p>
                  <p className="card-text"><strong>Price:</strong> ₹{food.price}</p>
                  <Link to="/Cart" className="btn btn-primary mt-auto">Add to Cart</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
