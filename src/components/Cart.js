import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { Button, Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [paymentLinkSent, setPaymentLinkSent] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [paymentComplete, setpaymentComplete] = useState(false);

  // ✅ Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      setCart(savedCart);
    }
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5289/api/friends/list/${user.id}`
      );
      if (response.data && Array.isArray(response.data)) {
        setFriends(response.data);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setError("Error fetching friends list");
    } finally {
      setIsLoading(false);
    }
  };

  const proceedToPayment = async () => {
    try {
      setIsPayment(true);
      console.log("Proceeding to payment with items:", cart);

      const orderRequest = {
        orderItems: cart.map((item) => ({
          foodItemId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          imageUrl: item.imageUrl,
        })),
        friends: friends.length > 0 ? friends.map((friend) => friend.friendId) : [],
      };

      console.log("Order request payload:", orderRequest);

      const orderResponse = await axios.post(
        `http://localhost:5289/api/orders/create/${user.id}`,
        orderRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (orderResponse.status === 201) {
        const newOrderId = orderResponse.data.orderId;
        setOrderId(newOrderId);
        console.log("Order created successfully:", newOrderId);

        // ✅ Send Payment Links
        await sendPaymentLinks(newOrderId);
        setpaymentComplete(true);

        // ✅ Clear cart after successful payment
        setCart([]);
        localStorage.removeItem("cart"); // Also clear from local storage
      } else {
        setError("Failed to create an order.");
      }
    } catch (error) {
      console.error("Error during payment:", error.response?.data || error);
      setError(error.response?.data?.message || "An error occurred during payment.");
    } finally {
      setIsPayment(false);
    }
  };

  const sendPaymentLinks = async (newOrderId) => {
    try {
      console.log("Sending payment links for order:", newOrderId);
      const paymentData = {
        userId: user.id,
        orderId: newOrderId,
      };
      const response = await axios.post(
        `http://localhost:5289/api/payment/send-links`,
        paymentData
      );
  
      console.log("Payment link response:", response.data);
      if (response.status === 200) {
        setPaymentLinkSent(true);
      } else {
        setPaymentLinkSent(false);
        setError("Failed to send payment links.");
      }
    } catch (error) {
      console.error("Error sending payment links:", error);
      setError("Failed to send payment links.");
    }
  };  

  const increaseQuantity = (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    setCart(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Your Cart</h1>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading...</p>
        </div>
      ) : cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.id} className="mb-3">
            <Row>
              <Col md={4}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </Col>
              <Col md={4}>
                <span>{item.name}</span>
              </Col>
              <Col md={2}>
                <span>${item.price}</span>
              </Col>
              <Col md={2}>
                <Button
                  variant="outline-secondary"
                  onClick={() => increaseQuantity(item.id)}
                >
                  +
                </Button>
                <span> {item.quantity} </span>
                <Button
                  variant="outline-secondary"
                  onClick={() => decreaseQuantity(item.id)}
                >
                  -
                </Button>
                <Button variant="danger" onClick={() => removeItem(item.id)}>
                  Remove
                </Button>
              </Col>
            </Row>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}

      {cart.length > 0 && <h3>Total: ${calculateTotalPrice()}</h3>}

      {error && <Alert variant="danger">{error}</Alert>}

      {paymentLinkSent && (
        <Alert variant="success">Payment links have been sent to your friends!</Alert>
      )}

      <h2 className="mt-4">Share Your Cart</h2>
      {Array.isArray(friends) && friends.length > 0 ? (
        friends.map((friend) => (
          <div key={friend.friendId}>
            <Button
              variant="outline-primary"
              className="mb-2"
              onClick={() => alert(`Sharing with ${friend.name}`)}
            >
              Share with {friend.name}
            </Button>
          </div>
        ))
      ) : (
        <p>No friends to share with.</p>
      )}

      {isPayment ? (
        <div className="text-center mt-4">
          <Spinner animation="border" variant="primary" />
          <p>Processing your payment...</p>
        </div>
      ) : (
        <Button
          variant="primary"
          onClick={paymentComplete ? () => navigate(`/orders/${orderId}`) : proceedToPayment}
          className="w-100 mt-3"
          disabled={isPayment} // ✅ Only disable during checkout process
        >
          {paymentComplete ? "View Order" : "Proceed to Payment"}
        </Button>
      )}
    </Container>
  );
};

export default Cart;
