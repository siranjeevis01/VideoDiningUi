import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    await axios.post("https://localhost:7179/api/users/reset-password-request", { email });
    alert("Password reset link sent!");
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleResetPassword}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
