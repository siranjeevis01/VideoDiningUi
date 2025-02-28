import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Home.css";
import { useCart } from "../../context/CartContext"; // ✅ Import Cart Context

const Home = () => {
  const { addToCart } = useCart(); // ✅ Use Cart Context
  const [foods, setFoods] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("https://localhost:7179/api/foods");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          const formattedFoods = response.data.map((food) => ({
            id: food.Id,
            name: food.Name,
            price: food.Price,
            description: food.Description || "No description available",
            imageUrl: food.ImageUrl || "/images/default-food.jpg",
          }));

          setFoods(formattedFoods); // ✅ Store formatted foods
        } else {
          console.error("Unexpected API response format:", response.data);
          setFoods([]);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Failed to load food items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  if (loading) return <div className="text-center mt-4"><h4>Loading...</h4></div>;
  if (error) return <div className="text-center mt-4"><h4>{error}</h4></div>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Welcome to Video Dining App</h2>
      
      {foods.length === 0 ? (
        <div className="text-center"><h5>No food items available.</h5></div>
      ) : (
        <div className="row d-flex justify-content-center">
          {foods.map((food, index) => (
            <div key={food.id || index} className="col-md-4 d-flex align-items-stretch mb-3">
              <div className="card w-100 food-card shadow-sm">
                <img 
                  src={food.imageUrl} 
                  className="card-img-top food-image" 
                  alt={food.name} 
                  onError={(e) => {
                    e.target.onerror = null; // ✅ Prevent infinite loop
                    e.target.src = "/images/default-food.jpg";
                  }} 
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{food.name}</h5>
                  <p className="card-text flex-grow-1">{food.description}</p>
                  <p className="card-text"><strong>Price:</strong> ₹{food.price}</p>
                  
                  {/* ✅ Properly Add to Cart */}
                  <button 
                    className="btn btn-primary mt-auto"
                    onClick={() => addToCart(food)}
                  >
                    Add to Cart
                  </button>
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
