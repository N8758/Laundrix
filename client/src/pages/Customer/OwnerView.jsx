// client/src/pages/Customer/OwnerView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OwnerView() {
  const { id } = useParams(); // route param /owner/:id
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      const res = await fetch(`https://api.neocleanhubs.com/api/customer/owner/${id}`);
      if (res.ok) {
        const d = await res.json();
        setOwner(d.owner);
      } else {
        const err = await res.json();
        alert(err.message || "Owner not found");
        navigate("/scan-owner");
      }
    }
    load();
  }, [id, navigate]);

  if (!owner) return <div style={{ padding: 20 }}>Loading owner...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "24px auto" }}>
      <h2>{owner.shopName} — Services</h2>
      <p><strong>Owner:</strong> {owner.ownerName}</p>
      <p><strong>ID:</strong> {owner.uniqueID}</p>

      <div style={{ display: "grid", gap: 12 }}>
        {(owner.services || []).length === 0 && <div>No services yet</div>}

        {(owner.services || []).map((s) =>
          <div key={s.id} style={{ border: "1px solid #eee", padding: 12, borderRadius: 6 }}>
            <div><strong>{s.title}</strong></div>
            <div>{s.desc}</div>
            <div>Price: ₹{s.price}</div>
            {s.imageBase64 && <img src={s.imageBase64} alt={s.title} style={{ width: 120, marginTop: 8 }} />}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => navigate("/place-order", { state: { ownerId: owner.uniqueID, service: s } })}>Place Order</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
