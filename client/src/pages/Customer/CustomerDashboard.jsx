// client/src/pages/Customer/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import ServiceDetails from "./ServiceDetails";
import BookService from "./BookService";
import CustomerProfile from "./CustomerProfile";
import CustomerFeedback from "./CustomerFeedback";
import "./style/CustomerDashboard.css";

export default function CustomerDashboard() {
  const ownerId = localStorage.getItem("ownerId");

  const [owner, setOwner] = useState(null);
  const [tab, setTab] = useState("services");
  const [approvedFeedback, setApprovedFeedback] = useState([]);
  const [customer, setCustomer] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      window.location.href = "/customer-login";
    }
  }, []);

  // Fetch owner on mount
  useEffect(() => {
    if (!ownerId) return;
    fetchOwner();
  }, [ownerId]);

  // Fetch customer on mount
  useEffect(() => {
    fetchCustomer();
  }, []);

  // Fetch approved feedback when owner is loaded
  useEffect(() => {
    if (!owner) return;
    fetchApprovedFeedback(owner.unique_id);
  }, [owner]);

  function handleLogout() {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("ownerId");
    window.location.href = "/";
  }

  async function fetchOwner() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/owner/${ownerId}`);
      if (!res.ok) return alert("Owner not found");
      const data = await res.json();
      setOwner(data.owner);
    } catch (error) {
      console.error(error);
      alert("Failed to load owner");
    }
  }

  async function fetchCustomer() {
    try {
      const token = localStorage.getItem("customerToken");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setCustomer(data.customer);
    } catch (err) {
      console.log("Error fetching customer");
    }
  }

  async function fetchApprovedFeedback(oid) {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/feedback/customer/${oid}`);
      const data = await res.json();
      setApprovedFeedback(data.feedbacks || []);
    } catch (e) {
      console.log("Error loading approved feedback");
    }
  }

  // Loading state
  if (!owner) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <span>Loading laundry...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <div className="dashboard-header">
        <div className="dashboard-header__info">
          <h2>{customer?.name || "Customer"} — {owner.shop_name}</h2>
          <p><strong>ID:</strong> {owner.unique_id}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        <button
          onClick={() => setTab("services")}
          className={`tab-btn ${tab === "services" ? "active" : ""}`}
        >
          Services
        </button>
        <button
          onClick={() => setTab("booking")}
          className={`tab-btn ${tab === "booking" ? "active" : ""}`}
        >
          Book Service
        </button>
        <button
          onClick={() => setTab("profile")}
          className={`tab-btn ${tab === "profile" ? "active" : ""}`}
        >
          Profile
        </button>
        <button
          onClick={() => setTab("feedback")}
          className={`tab-btn ${tab === "feedback" ? "active" : ""}`}
        >
          Feedback
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="tab-panel">

        {tab === "services" && <ServiceDetails ownerId={owner.unique_id} />}

        {tab === "booking" && <BookService ownerId={owner.unique_id} />}

        {tab === "profile" && <CustomerProfile owner={owner} />}

        {tab === "feedback" && (
          <div>
            <CustomerFeedback ownerId={owner.unique_id} />

            {/* APPROVED FEEDBACK LIST */}
            {approvedFeedback.length > 0 && (
              <div className="feedback-list">
                {approvedFeedback.map((f) => (
                  <div key={f.id} className="feedback-card">
                    <div className="feedback-card__header">
                      <span className="feedback-card__name">{f.name}</span>
                      <span className="feedback-card__rating">⭐ {f.rating}</span>
                    </div>
                    <p className="feedback-card__service">{f.service}</p>
                    <p className="feedback-card__comment">{f.suggestion}</p>
                  </div>
                ))}
              </div>
            )}

            {approvedFeedback.length === 0 && (
              <p style={{ color: "#9ca3af", marginTop: 16, fontSize: 14 }}>
                
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}