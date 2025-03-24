import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const userId = searchParams.get("userId");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    if (!otp.trim()) {
        setMessage("⚠️ Please enter your OTP.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5289/api/payment/verifyOtp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                orderId: Number(orderId),
                userId: Number(userId),
                otp: otp.trim()
            }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessage("✅ Payment successful! Redirecting...");
            setTimeout(() => {
                window.location.href = `/orders/${orderId}`;  
            }, 2000);
        } else {
            setMessage("❌ " + data.message);
        }
    } catch (error) {
        setMessage("⚠️ Error processing payment. Try again.");
    }
};

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>💳 Payment Page</h2>
      <p><strong>Order ID:</strong> {orderId}</p>
      <p><strong>User ID:</strong> {userId}</p>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
        Pay Now
      </button>
      {message && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{message}</p>}
    </div>
  );
};

export default Payment;
