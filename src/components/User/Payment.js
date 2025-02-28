import React, { useState, useEffect } from "react";
import axios from "axios";

const Payment = () => {
  const [email, setEmail] = useState("");
  const [groupOrderId, setGroupOrderId] = useState("");
  const [orderId, setOrderId] = useState("N/A");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [razorpaySignature, setRazorpaySignature] = useState("");
  const [error, setError] = useState("");
  const [orderItems, setOrderItems] = useState([]); // Declare orderItems state

  useEffect(() => {
    // Fetch the latest order details
    axios
      .get("https://localhost:7179/api/orders/get-latest-group-order")
      .then((res) => {
        console.log("Order API Response:", res.data);
        if (res.data.groupOrderId) {
          setGroupOrderId(res.data.groupOrderId);
          setOrderId(res.data.orderId || "N/A");

          // Fetch the order items based on the orderId
          axios
          .get(`https://localhost:7179/api/orders/get-items/${res.data.orderId}`)
          .then((itemsRes) => {
            console.log("Items API Response:", itemsRes.data);
            setOrderItems(itemsRes.data.items || []);
          })
          .catch((itemsErr) => {
            console.error("Error Fetching Order Items:", itemsErr);
            setError("Failed to fetch order items.");
          });        

        } else {
          setError("Group Order ID is missing. Please place an order first.");
        }
      })
      .catch((err) => {
        console.error("API Error:", err.response || err);
        setError("No recent group orders found. Please create an order first.");
      });
  }, []);

  const sendOtp = async () => {
    if (!email || !groupOrderId) {
      setError("Email and Group Order ID are required!");
      return;
    }

    setError("");
    setIsSendingOtp(true);

    try {
      const res = await axios.post("https://localhost:7179/api/Payment/send-otp", { email, groupOrderId });
      console.log("OTP Sent Response:", res.data);

      if (res.data.razorpaySignature) {
        setRazorpaySignature(res.data.razorpaySignature); // Store Razorpay Signature
      }

      setOtpSent(true);
      setOtpCooldown(300);

      const countdown = setInterval(() => {
        setOtpCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("OTP Sending Error:", err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter OTP!");
      return;
    }

    setError("");
    setIsVerifyingOtp(true);

    if (!razorpaySignature) {
      setError("Missing Razorpay Signature!");
      return;
    }

    try {
      const payload = {
        email,
        otp,
        groupOrderId,
        RazorpaySignature: razorpaySignature,
      };

      const res = await axios.post("https://localhost:7179/api/Payment/verify-otp", payload);
      console.log("OTP Verification Response:", res.data);
      alert(res.data.message);

      if (res.data.message === "OTP verified successfully!") {
        setOtpVerified(true);
      } else {
        setError("Invalid OTP. Please try again.");
        setOtpVerified(false);
      }
    } catch (err) {
      console.error("OTP Verification Error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePaymentError = (error) => {
    if (error.response) {
      console.error("Payment API Error:", error.response.data);
      setError(`Payment failed: ${error.response.data.message}`);
    } else if (error.request) {
      console.error("Payment API Error:", error.request);
      setError("Payment failed: No response from server.");
    } else {
      console.error("Payment API Error:", error.message);
      setError("Payment failed: Unknown error.");
    }
  };

  const processPayment = async () => {
    if (!email || !otp || !groupOrderId || !orderId || !razorpaySignature) {
      console.error("Missing Fields:", { email, otp, groupOrderId, orderId, razorpaySignature });
      setError("All fields are required for payment!");
      return;
    }

    // Check if orderItems exist and are not empty
    if (!orderItems || orderItems.length === 0) {
      setError("No items found in your order. Please add items to your cart.");
      return;
    }

    setIsPaying(true);
    setError("");

    const payload = {
      email,
      otp,
      groupOrderId,
      paymentDetails: "Razorpay",
      orderId,
      RazorpaySignature: razorpaySignature,
    };

    console.log("Sending Payment Payload:", payload);

    try {
      const res = await axios.post("https://localhost:7179/api/Payment/process-payment", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`  // Add token here if needed
        },
      });
      console.log("Payment Success Response:", res.data);
      setPaymentSuccess(true);
    } catch (err) {
      handlePaymentError(err);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Payment</h2>
      {error && <p style={styles.errorMessage}>{error}</p>}
      {paymentSuccess && <p style={styles.successMessage}>✅ Payment Successful!</p>}

      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

      <label>Group Order ID:</label>
      <input type="text" value={groupOrderId} disabled style={styles.inputDisabled} />

      <label>Order ID:</label>
      <input type="text" value={orderId} disabled style={styles.inputDisabled} />

      <button onClick={sendOtp} style={isSendingOtp || otpCooldown > 0 ? styles.buttonDisabled : styles.button} disabled={isSendingOtp || otpCooldown > 0}>
        {isSendingOtp ? "Sending..." : otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : "Send OTP"}
      </button>

      {otpSent && (
        <>
          <label>Enter OTP:</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} style={styles.input} />
          <button onClick={verifyOtp} style={isVerifyingOtp ? styles.buttonDisabled : styles.button} disabled={isVerifyingOtp}>
            {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}

      {otpVerified && !paymentSuccess && (
        <button onClick={processPayment} style={isPaying ? styles.buttonDisabled : styles.button} disabled={isPaying}>
          {isPaying ? "Processing..." : "Pay with Razorpay"}
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  title: { fontSize: "22px", marginBottom: "10px", color: "#333" },
  input: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  inputDisabled: {
    width: "100%",
    padding: "8px",
    margin: "5px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#f3f3f3",
  },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonDisabled: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    backgroundColor: "#ddd",
    color: "#999",
    border: "none",
    borderRadius: "5px",
    cursor: "not-allowed",
    fontSize: "16px",
  },
  successMessage: {
    color: "green",
    fontSize: "18px",
    marginTop: "10px",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default Payment;
