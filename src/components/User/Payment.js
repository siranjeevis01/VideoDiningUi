import React, { useState, useEffect } from "react";
import axios from "axios";

const Payment = () => {
  const [email, setEmail] = useState("");
  const [groupOrderId, setGroupOrderId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [orderId, setOrderId] = useState("N/A");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7179/api/orders/get-latest-group-order")
      .then((res) => {
        console.log("Order API Response:", res.data);

        if (res.data.groupOrderId) {
          setGroupOrderId(res.data.groupOrderId);
        } else {
          setError("Group Order ID is missing. Please place an order first.");
        }

        setOrderId(res.data.orderId || "N/A");
      })
      .catch(() => {
        setError("No recent group orders found. Please create an order first.");
      });
  }, []);

  const sendOtp = async () => {
    if (!email || !groupOrderId) {
      setError("Email and Group Order ID are required!");
      return;
    }
    setError("");

    try {
      const res = await axios.post("https://localhost:7179/api/Payment/send-otp", { email, groupOrderId });
      console.log("OTP Sent Response:", res.data);

      setOtpSent(true);
      setOtpCooldown(30);

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
      setError("Failed to send OTP.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setError("Enter OTP!");
      return;
    }

    setError("");
    try {
      const res = await axios.post("https://localhost:7179/api/Payment/verify-otp", {
        email,
        otp,
        groupOrderId,
      });

      console.log("OTP Verification Response:", res.data);
      alert(res.data.message);
      setOtpSent(res.data.message === "OTP verified successfully!");
    } catch (err) {
      console.error("OTP Verification Error:", err.response?.data);
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtpSent(false);
    }
  };

  const processPayment = async () => {
    if (!email || !otp || !groupOrderId || !orderId) {
      console.error("Missing Fields:", { email, otp, groupOrderId, orderId });
      setError("All fields are required for payment!");
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
    };

    console.log("Sending Payment Payload:", payload);

    try {
      const res = await axios.post("https://localhost:7179/api/Payment/process-payment", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Payment Success Response:", res.data);
      setPaymentSuccess(true);
    } catch (err) {
      console.error("Payment Error:", err.response?.data);
      setError(err.response?.data?.message || "Payment failed.");
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

      <button onClick={sendOtp} style={styles.button} disabled={otpCooldown > 0}>
        {otpCooldown > 0 ? `Resend OTP (${otpCooldown}s)` : otpSent ? "Resend OTP" : "Send OTP"}
      </button>

      {otpSent && (
        <>
          <label>Enter OTP:</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} style={styles.input} />
          <button onClick={verifyOtp} style={styles.button}>Verify OTP</button>
        </>
      )}

      {otpSent && !paymentSuccess && (
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
  },
  title: { fontSize: "22px", marginBottom: "10px" },
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
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonDisabled: {
    backgroundColor: "#aaa",
    cursor: "not-allowed",
  },
  successMessage: { color: "green", fontSize: "16px", marginTop: "10px" },
  errorMessage: { color: "red", fontSize: "16px", marginTop: "10px" },
};

export default Payment;
