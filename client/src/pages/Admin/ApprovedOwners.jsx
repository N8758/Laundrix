import React, { useEffect, useState } from "react";
import "./ApprovedOwners.css";

export default function ApprovedOwners() {

  const [owners, setOwners] = useState([]);
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    try {

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/approved`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await res.json();

      setOwners(data.approved || []);

    } catch (error) {
      alert("Failed to load approved owners");
      console.log(error);
    }
  }

  if (!owners.length) {
    return (
      <div className="approved-container">
        <h2>No approved owners yet</h2>
      </div>
    );
  }

  return (
    <div className="approved-container">

      <h2 className="approved-title">
        Approved Laundry Owners
      </h2>

      <div className="filter-buttons">

        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button onClick={() => setFilter("inactive")}>
          Inactive
        </button>

      </div>

      {message && (
        <p className="success-message">
          {message}
        </p>
      )}

      {owners
        .filter((o) => {

          if (filter === "active") {
            return o.usage_status === "active";
          }

          if (filter === "inactive") {
            return o.usage_status === "inactive";
          }

          return true;
        })

        .map((o) => (

          <div
            className="owner-card"
            key={o.unique_id}
          >

            <p>
              <b>{o.shop_name || "—"}</b> — {o.owner_name}
            </p>

            <p>ID: {o.unique_id}</p>

            <p>Email: {o.email}</p>

            <p>Mobile: {o.mobile}</p>

            <p>
              Status:

              {o.usage_status === "active" ? (
                <span className="active-status">
                  🟢 Active
                </span>
              ) : (
                <span className="inactive-status">
                  🔴 Inactive
                </span>
              )}

            </p>

            <button
              className="reminder-btn"
              onClick={async () => {

                const res = await fetch(
                  `${process.env.REACT_APP_API_URL}/api/admin/send-reminder`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
                    },
                    body: JSON.stringify({
                      ownerName: o.owner_name
                    }),
                  }
                );

                const data = await res.json();

                setMessage(data.message);

              }}
            >
              Send Reminder
            </button>

            <br />

            <img
              src={o.qr_code_data_url}
              alt="QR"
              className="qr-image"
            />

          </div>

        ))}

    </div>
  );
}