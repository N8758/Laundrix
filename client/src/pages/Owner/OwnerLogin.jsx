import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style/ownerlogin.css";

export default function OwnerLogin() {
  const [key, setKey] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/owner/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, password }),
    });

    const data = await res.json();

    if (res.status === 200) {

  alert("Login Successful");

  localStorage.setItem(
    "ownerToken",
    data.token
  );

  localStorage.setItem(
    "subscription",
    JSON.stringify(
      data.subscription
    )
  );

  navigate("/owner-dashboard");
} else {
      alert(data.message);
    }
  } catch (error) {
    alert("Login failed");
    console.error(error);
  }
};

  return (
  <div className="owner-login-container">
    <input
      type="text"
      placeholder="Laundry ID or Email"
      onChange={(e) => setKey(e.target.value)}
      className="owner-input"
    />

    <input
      type="password"
      placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
      className="owner-input"
    />

    <button className="owner-login-btn" onClick={handleLogin}>
      Login
    </button>
  </div>
);

}

const styles = {
  container: {
    width: "400px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    textAlign: "center",
  },
  input: { width: "100%", padding: "10px", margin: "10px 0" },
  button: {
    width: "100%",
    padding: "10px",
    background: "#3a6ff7",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
