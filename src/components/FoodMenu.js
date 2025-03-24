import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; 

const API_URL = "http://localhost:5289/api/friends";
const FOOD_API_URL = "http://localhost:5289/api/foods";

const FoodMenu = () => {
  const { user, loading } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext); 
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchMenuItems();
    }
  }, [user]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${API_URL}/list/${user.id}`);
      setFriends(response.data || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(FOOD_API_URL);
      setMenuItems(response.data || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends(prevState =>
      prevState.includes(friend)
        ? prevState.filter(f => f !== friend)
        : [...prevState, friend]
    );
  };

  const handleItemSelection = (item) => {
    setSelectedItems(prevState => {
      if (prevState.includes(item.id)) {
        return prevState.filter(i => i !== item.id);
      } else {
        return [...prevState, item.id];
      }
    });
  };

  const shareOrder = () => {
    const orderDetails = {
      userId: user.id,
      friends: selectedFriends.map(f => f.friendId),
      items: menuItems.filter(item => selectedItems.includes(item.id)),
    };

    // Add selected food items to the cart
    orderDetails.items.forEach((item) => {
      addToCart({ ...item, quantity: 1 }); // Ensure items have quantity
    });

    console.log('Order Shared:', orderDetails);
    alert("Order shared and items added to cart!");
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in to view the menu.</p>;

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Food Menu</h1>

      <div className="row">
        {/* Friends Selection */}
        <div className="col-md-6">
          <h4>Select Friends to Share Order</h4>
          {friends.length > 0 ? (
            friends.map(friend => (
              <div key={friend.friendId} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selectedFriends.includes(friend)}
                  onChange={() => toggleFriendSelection(friend)}
                />
                <label className="form-check-label">{friend.name} ({friend.email})</label>
              </div>
            ))
          ) : (
            <p>No friends available.</p>
          )}
        </div>

        <div className="col-md-6">
          <h4>Menu</h4>
          <div className="row">
            {menuItems.length > 0 ? (
              menuItems.map(item => (
                <div key={item.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                  <div className="card"
                    style={{
                      transition: 'transform 0.3s ease-in-out',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                      marginBottom: '20px',
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      position: 'relative',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = ''}
                  >
                    <img src={item.imageUrl || "https://via.placeholder.com/200"} alt={item.name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }} />
                    <div className="card-body" style={{ padding: '15px' }}>
                      <h5 className="card-title" style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>{item.name}</h5>
                      <p className="card-text" style={{ fontSize: '16px', margin: '10px 0', color: '#555' }}>${item.price}</p>
                      <button
                        style={{
                          padding: '8px 20px',
                          border: 'none',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          fontSize: '14px',
                          transition: 'background-color 0.3s ease',
                          backgroundColor: selectedItems.includes(item.id) ? '#28a745' : '#007bff',
                          color: 'white',
                        }}
                        onClick={() => handleItemSelection(item)}
                      >
                        {selectedItems.includes(item.id) ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No menu items available.</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={shareOrder}>Share Order with Friends</button>
      </div>
    </div>
  );
};

export default FoodMenu;
