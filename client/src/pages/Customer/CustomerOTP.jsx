// client/src/pages/Customer/CustomerOTP.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerOTP() {
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const m = localStorage.getItem("customerMobileForOtp");
    if (!m) {
      navigate("/customer-login");
      return;
    }
    setMobile(m);
  }, [navigate]);

  
  const verify = async () => {
  try {
    const name = localStorage.getItem("customerName");

    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, otp, name }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("customerToken", data.token);
      localStorage.removeItem("customerMobileForOtp");
      navigate("/customer-scan");
    } else {
      alert(data.message || "Invalid OTP");
    }

  } catch (error) {
    console.error(error);
    alert("Verification failed");
  }
};

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20, border: "1px solid #ddd" }}>
      <h2>Enter OTP</h2>
      <p>Mobile: {mobile}</p>
      <input type="number" placeholder="Enter OTP" value={otp} onChange={(e)=>setOtp(e.target.value)} style={{width:"100%", padding:10, margin:"10px 0"}}/>
      <button onClick={verify} style={{...btnStyle}}>Verify & Continue</button>
    </div>
  );
}

const btnStyle = { width: "100%", padding: 10, background: "#3a6ff7", color:"#fff", border: "none" };
