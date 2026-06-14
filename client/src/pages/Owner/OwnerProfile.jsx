import React, { useState } from "react";
import "./style/Ownerprofile.css";
const BASE_URL = process.env.REACT_APP_API_URL;

export default function OwnerProfile({ owner, token, refreshOwner }) {
  const [form, setForm] = useState({
    ownerName: owner.ownerName || "",
    shopName: owner.shopName || "",
    businessEmail: owner.businessEmail || "",
    address: owner.address || "",
    gstin: owner.gstin || "",
  latitude: owner.latitude || "",
  longitude: owner.longitude || ""
  });

  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      setForm((prev) => ({
        ...prev,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      }));
      alert("Location captured ✅");
    },
    () => {
      alert("Unable to get location ❌");
    }
  );
};

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/owner/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
      } else {
        alert("Profile updated successfully ✅");
        refreshOwner();
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h3 className="profile-heading">Profile</h3>

      {/* EDITABLE FIELDS */}
      <div className="profile-form">

        <div className="profile-field">
          <label>Owner Name</label>
          <input
  name="ownerName"
  value={form.ownerName}
  onChange={handleChange}
  disabled={!editMode}
/>
        </div>

        <div className="profile-field">
          <label>Shop Name</label>
          <input
            name="shopName"
            value={form.shopName}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Email</label>
          <input
            name="businessEmail"
            value={form.businessEmail}
            onChange={handleChange}
          />
        </div>

        <div className="profile-field">
          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="profile-field">
  <label>GSTIN</label>
  <input
  name="gstin"
  value={form.gstin}
  onChange={(e) =>
    setForm({
      ...form,
      gstin: e.target.value.toUpperCase()
    })
  }
  maxLength={15}
  disabled={!editMode}
/>
</div>

<div className="profile-field">
  <label>Latitude</label>
  <input
    name="latitude"
    value={form.latitude}
    onChange={handleChange}
    disabled={!editMode}
  />
</div>

<div className="profile-field">
  <label>Longitude</label>
  <input
    name="longitude"
    value={form.longitude}
    onChange={handleChange}
    disabled={!editMode}
  />
  {editMode && (
  <button
    className="btn-update-profile"
    onClick={getLocation}
    style={{ marginTop: "10px" }}
  >
    Capture Location 📍
  </button>
)}
</div>

      </div>

      {/* NON-EDITABLE */}
      <div className="profile-static">
        <p><strong>Mobile:</strong> {owner.mobile}</p>
        <p><strong>Laundry ID:</strong> {owner.uniqueID}</p>
      </div>

      {/* QR SECTION */}
      <div className="profile-qr">
        <span className="profile-qr-label">QR Code</span>

        <img
          src={owner.qrCodeDataUrl}
          alt="QR"
        />

        <div className="profile-qr-actions">
          <button
            className="btn-qr-download"
            onClick={() => {
              const a = document.createElement("a");
              a.href = owner.qrCodeDataUrl;
              a.download = `${owner.uniqueID}-qr.png`;
              a.click();
            }}
          >
            Download QR
          </button>

          <button
            className="btn-qr-copy"
            onClick={() => {
              navigator.clipboard.writeText(owner.qrCodeDataUrl);
              alert("QR copied!");
            }}
          >
            Copy QR
          </button>
        </div>
      </div>

      {/* UPDATE BUTTON */}
      {!editMode ? (
  <button
    className="btn-update-profile"
    onClick={() => setEditMode(true)}
  >
    Edit Profile
  </button>
) : (
  <button
    className="btn-update-profile"
    onClick={async () => {
      await handleUpdate();
      setEditMode(false);
    }}
    disabled={loading}
  >
    {loading ? "Saving..." : "Save"}
  </button>
)}
    </div>
  );
}