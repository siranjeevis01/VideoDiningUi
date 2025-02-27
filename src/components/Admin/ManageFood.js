import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  
  useEffect(() => {
    axios.get("https://localhost:7179/api/foods").then((res) => setFoods(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`https://localhost:7179/api/foods/${id}`);
    setFoods(foods.filter((food) => food.id !== id));
  };

  return (
    <div>
      <h3>Manage Foods</h3>
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            {food.name} - ${food.price} 
            <button onClick={() => handleDelete(food.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageFoods;
