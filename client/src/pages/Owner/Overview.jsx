import React from "react";

export default function Overview({ owner }) {
  if (!owner) return <div>Loading...</div>;

  return (
    <div>
      <h3>Overview</h3>

      <p><strong>Owner Name:</strong> {owner.ownerName}</p>
      <p><strong>Shop Name:</strong> {owner.shopName}</p>

      <p>
        <strong>ID:</strong> {owner.uniqueID}
        <button
          onClick={() => {
            navigator.clipboard.writeText(owner.uniqueID);
            alert("ID copied!");
          }}
          style={{
            marginLeft: 10,
            padding: "4px 10px",
            background: "#3a6ff7",
            color: "white",
            border: "none",
            borderRadius: 5
          }}
        >
          Copy
        </button>
      </p>

      <p><strong>Mobile:</strong> {owner.mobile}</p>
      <p><strong>Address:</strong> {owner.address}</p>

      {/* ✅ QR SECTION */}
      <div style={{ marginTop: 20 }}>
        <strong>QR Code</strong>
        <br />

        <img
          src={owner.qrCodeDataUrl}
          alt="QR"
          style={{ width: 150, marginTop: 10 }}
        />

        <div style={{ marginTop: 10 }}>
          <button
            onClick={() => {
              const a = document.createElement("a");
              a.href = owner.qrCodeDataUrl;
              a.download = `${owner.uniqueID}-qr.png`;
              a.click();
            }}
            style={{
              marginRight: 10,
              padding: "5px 10px",
              background: "#3a6ff7",
              color: "white",
              border: "none",
              borderRadius: 5
            }}
          >
            Download QR
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(owner.qrCodeDataUrl);
              alert("QR copied!");
            }}
            style={{
              padding: "5px 10px",
              background: "#555",
              color: "white",
              border: "none",
              borderRadius: 5
            }}
          >
            Copy QR
          </button>
        </div>
      </div>
    </div>
  );
}