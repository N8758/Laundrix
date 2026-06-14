// client/src/pages/Customer/CustomerLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/customerlogin.css";

export default function CustomerLogin() {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const requestOtp = async () => {
  try {
    // NAME REQUIRED
    if (!name.trim()) return alert("Please enter your name");

    // MOBILE VALIDATION
    // MOBILE VALIDATION
if (!/^[6-9]\d{9}$/.test(mobile)) {
  return alert("Enter valid 10 digit mobile number");
}

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, name }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP generated (check backend console)");

      localStorage.setItem("customerMobileForOtp", mobile);
      localStorage.setItem("customerName", name);

      navigate("/customer-otp");
    } else {
      alert(data.message || "Error while generating OTP");
    }

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="customer-login-container">
      <h2>Customer Login</h2>

      <input
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="customer-login-input"
      />

      <input
  placeholder="Mobile Number"
  value={mobile}
  maxLength={10}
  onChange={(e) =>
    setMobile(
      e.target.value.replace(/\D/g, "")
    )
  }
  className="customer-login-input"
/>

      <button onClick={requestOtp} className="customer-login-btn">Get OTP</button>
    </div>
  );
}

