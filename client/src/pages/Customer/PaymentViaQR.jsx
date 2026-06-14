// client/src/pages/Customer/PaymentViaQR.jsx
import React, { useState } from "react";

export default function PaymentViaQR({ owner, token }) {
  const [amount, setAmount] = useState("");

  async function pay() {
    if (!amount) return alert("Enter amount");
    const res = await fetch("https://api.neocleanhubs.com/api/customer/pay-via-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ownerID: owner.uniqueID, amount }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Payment recorded (simulated)");
      setAmount("");
    } else {
      alert(data.message || "Error");
    }
  }

  return (
    <div>
      <h3>Pay via QR</h3>
      <div style={{ display: "flex", gap: 12 }}>
        <div>
          {owner.qrCodeDataUrl ? (
            <img src={owner.qrCodeDataUrl} alt="QR" style={{ width: 200, height: 200, objectFit: "contain", border: "1px solid #eee" }} />
          ) : (
            <div style={{ width:200, height:200, display:"flex", alignItems:"center", justifyContent:"center", border:"1px dashed #ccc" }}>No QR uploaded</div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <p><strong>Laundry:</strong> {owner.shopName}</p>
          <p><strong>ID:</strong> {owner.uniqueID}</p>

          <input placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} style={{ width: "100%", padding: 10, margin: "10px 0" }} />
          <button onClick={pay} style={{ padding: 10, background: "#3a6ff7", color: "#fff", border: "none" }}>Pay (simulate)</button>
        </div>
      </div>
    </div>
  );
}
