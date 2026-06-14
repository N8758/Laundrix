// client/src/pages/Customer/PlaceOrder.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function PlaceOrder() {
  const loc = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("customerToken");
  const { ownerId, service } = loc.state || {};

  const [qty, setQty] = useState(1);

  if (!ownerId || !service) {
    return <div style={{ padding: 20 }}>No service selected</div>;
  }

  async function submit() {
    const payload = {
      ownerId,
      services: [{ id: service.id, title: service.title, price: service.price }],
      amount: service.price * (Number(qty) || 1)
    };

    const res = await fetch("https://api.neocleanhubs.com/api/customer/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok) {
      alert("Order placed");
      navigate(`/owner/${ownerId}`);
    } else {
      if (res.status === 401) {
        alert("Please login again");
        localStorage.removeItem("customerToken");
        navigate("/customer-login");
      } else {
        alert(data.message || "Failed to place order");
      }
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h3>Place order — {service.title}</h3>
      <div>Price: ₹{service.price}</div>
      <label>Quantity:</label>
      <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} style={{ width: 80, marginLeft: 8 }} />
      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>Confirm & Pay (simulate)</button>
      </div>
    </div>
  );
}
