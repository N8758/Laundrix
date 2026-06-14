import React, { useEffect, useState } from "react";
import "./style/Staff.css";

export default function OwnerStaff({ ownerId }) {
  const [staffList, setStaffList] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [editId, setEditId] = useState(null);

  const BASE_URL = `${process.env.REACT_APP_API_URL}/api/owner/staff`;

  // ✅ Fetch Staff
  const fetchStaff = async () => {
    try {
      const res = await fetch(`${BASE_URL}/${ownerId}`);
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error("Fetch staff error:", err);
    }
  };

  useEffect(() => {
    if (ownerId) fetchStaff();
  }, [ownerId]);

  // ✅ Add Staff (NO staff_id)
  const handleAdd = async () => {
    try {
      if (!name.trim()) {
  alert("Please enter name");
  return;
}

if (!/^[A-Za-z ]+$/.test(name)) {
  alert("Name should contain only letters");
  return;
}

if (!/^[6-9]\d{9}$/.test(mobile)) {
  alert("Enter valid 10 digit mobile number");
  return;
}
      await fetch(`${BASE_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          owner_id: ownerId,
          name,
          mobile
        })
      });
      alert("Staff added successfully");

      setName("");
      setMobile("");
      fetchStaff();
    } catch (err) {
      console.error("Add staff error:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    fetchStaff();
  };

  // ✅ Update
  const handleUpdate = async () => {

    if (!name.trim()) {
  alert("Please enter name");
  return;
}

if (!/^[A-Za-z ]+$/.test(name)) {
  alert("Name should contain only letters");
  return;
}

if (!/^[6-9]\d{9}$/.test(mobile)) {
  alert("Enter valid 10 digit mobile number");
  return;
}
    await fetch(`${BASE_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, mobile })
    });
    alert("Staff updated successfully");

    setEditId(null);
    setName("");
    setMobile("");
    fetchStaff();
  };

  return (
    <div className="staff-wrapper">
      <div className="staff-container">

        {/* Header */}
        <div className="staff-header">
          <div className="staff-header-icon">👥</div>
          <div>
            <h2>Staff</h2>
            <span>owner · manage team</span>
          </div>
        </div>

        {/* Form */}
        <div className="staff-form-card">
          <div className="staff-form-label">
            <span className="dot"></span>
            {editId ? "Edit Member" : "Add New Member"}
          </div>

          <div className="staff-input-row">
            <div className="staff-field">
              <label>Name</label>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="staff-field">
              <label>Mobile</label>
              <input
  placeholder="Mobile"
  value={mobile}
  maxLength={10}
  onChange={(e) =>
    setMobile(
      e.target.value.replace(/\D/g, "")
    )
  }
/>
            </div>
          </div>

          <div className="staff-btn-row">
            {editId ? (
              <>
                <button className="staff-btn staff-btn-update" onClick={handleUpdate}>✓ Update</button>
                <button className="staff-btn staff-btn-cancel" onClick={() => { setEditId(null); setName(""); setMobile(""); }}>Cancel</button>
              </>
            ) : (
              <button className="staff-btn staff-btn-primary" onClick={handleAdd}>+ Add Staff</button>
            )}
          </div>
        </div>

        <hr style={{ borderColor: "var(--border)", marginBottom: "20px" }} />

        {/* List */}
        <div className="staff-list-header">
          <span>Team Members</span>
          <span className="staff-badge">{staffList.length}</span>
        </div>

        {staffList.length === 0 ? (
          <div className="staff-empty">
            <div className="staff-empty-icon">🪑</div>
            No staff added yet
          </div>
        ) : (
          staffList.map((s) => (
            <div key={s.id} className="staff-card">
              <div className="staff-avatar">
                {s.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
              </div>

              <div className="staff-info">
                <div className="staff-name">{s.name}</div>
                <div className="staff-meta">
                  <span className="staff-meta-chip">📱 {s.mobile}</span>
                  <span className="staff-meta-chip">🪪 {s.staff_id}</span>
                </div>
              </div>

              <div className="staff-card-actions">
                <button
                  className="staff-icon-btn edit"
                  onClick={() => {
                    setEditId(s.id);
                    setName(s.name);
                    setMobile(s.mobile);
                  }}
                >
                  ✏️
                </button>
                <button className="staff-icon-btn del" onClick={() => handleDelete(s.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}