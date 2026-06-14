import React, { useState, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";

export default function ScanOwner() {
  const [manualID, setManualID] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  function openLaundry(id) {
    if (!id) return alert("Please enter or scan Laundry ID");

    const cleanID = id.trim();
    localStorage.setItem("ownerId", cleanID);
navigate("/customer-dashboard");
  }

  useEffect(() => {
  const token = localStorage.getItem("customerToken");

  if (!token) {
    navigate("/customer-login");
  }
}, [navigate]);

  useEffect(() => {
  if (!showScanner) return;

  const html5QrCode = new Html5Qrcode("reader");

  const startScanner = async () => {
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: 250 },
        (decodedText) => {
  if (!showScanner) return;

  let value = decodedText.trim();

  if (value.includes("ownerId=")) {
    value = value.split("ownerId=")[1];
  }

  html5QrCode
  .stop()
  .then(() => {
    html5QrCode.clear();
    setShowScanner(false);
    openLaundry(value);
  })
  .catch(() => {
    setShowScanner(false);
    openLaundry(value);
  });
}
      );
    } catch (err) {
      console.log("Scanner start error:", err);
    }
  };

  startScanner();

 return () => {
  try {
    html5QrCode.clear();
  } catch (e) {
    // ignore
  }
};
}, [showScanner]);

  return (
    <div style={{ maxWidth: 450, margin: "60px auto", textAlign: "center" }}>
      <h2>Enter Laundry ID or Scan QR</h2>

      <input
        type="text"
        placeholder="LDRY001"
        value={manualID}
        onChange={(e) => setManualID(e.target.value)}
        style={{ width: "100%", padding: "10px", marginTop: 10 }}
      />

      <button
        onClick={() => openLaundry(manualID)}
        style={{
          width: "100%",
          padding: 12,
          background: "#3a6ff7",
          color: "white",
          border: "none",
          marginTop: 10
        }}
      >
        Open Laundry
      </button>

      <hr style={{ margin: "20px 0" }} />

      <button
        onClick={() => setShowScanner(true)}
        style={{
          width: "100%",
          padding: 12,
          background: "green",
          color: "white",
          border: "none"
        }}
      >
        Scan QR Code
      </button>
      {showScanner && <p>Scanning... point camera to QR</p>}

      {showScanner && (
        <div
          id="reader"
          style={{
            width: "100%",
            marginTop: 20
          }}
        />
      )}
    </div>
  );
}