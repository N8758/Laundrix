import React, { useState, useEffect } from "react";
import "./style/OwnerFeedback.css";

export default function OwnerFeedback({ ownerIdProp }) {
  const [ownerId, setOwnerId] = useState(ownerIdProp || "");
  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");

  const BASE_URL = `${process.env.REACT_APP_API_URL}/api/feedback`;

  const load = async (oid) => {
    if (!oid) return;
    try {
      const res = await fetch(`${BASE_URL}/owner/${oid}`);
      const body = await res.json();
      if (res.ok) {
        setFeedbacks(body.feedbacks || []);
      } else {
        setMessage(body.message || "Error loading feedbacks");
      }
    } catch (err) {
      setMessage("Network error, server not reachable");
    }
  };

  useEffect(() => {
    if (ownerId) load(ownerId);
  }, [ownerId]);

  const approve = async (feedbackId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/owner/${ownerId}/approve/${feedbackId}`,
        { method: "PATCH" }
      );
      const body = await res.json();
      if (res.ok) {
        setFeedbacks((prev) =>
          prev.map((f) =>
            f.id === feedbackId ? { ...f, status: "approved" } : f
          )
        );
      } else {
        setMessage(body.message || "Error approving");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  const remove = async (feedbackId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/owner/${ownerId}/${feedbackId}`,
        { method: "DELETE" }
      );
      const body = await res.json();
      if (res.ok) {
        setFeedbacks((prev) => prev.filter((f) => f.id !== feedbackId));
      } else {
        setMessage(body.message || "Error deleting");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  const pendingList  = feedbacks.filter(f => f.status === "pending");
  const approvedList = feedbacks.filter(f => f.status === "approved");

  return (
    <div className="feedback-root">
      <h2 className="feedback-title">Owner Feedbacks</h2>

      {!ownerIdProp && (
        <div style={{ marginBottom: 12 }}>
          <label>Owner ID: </label>
          <input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} />
          <button onClick={() => load(ownerId)}>Load</button>
        </div>
      )}

      {message && <p className="error-msg">{message}</p>}

      {/* ── PENDING ── */}
      <p className="section-label">Pending</p>

      {pendingList.length === 0 && (
        <p className="empty-msg">No pending feedbacks</p>
      )}

      {pendingList.map(f => (
        <div key={f.id} className="feedback-card">
          <div className="card-top">
            <span className="customer-name">{f.name}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="rating-badge">★ {f.rating}</span>
              {/* <span className="status-pill status-pending">Pending</span> */}
            </div>
          </div>

          <p className="service-tag">{f.services?.join(", ")}</p>
          <p className="suggestion-text">{f.suggestion}</p>
          <p className="feedback-date">{new Date(f.created_at).toLocaleString()}</p>

          <hr className="card-divider" />

          <div className="action-row">
            {/* <button className="btn btn-approve" onClick={() => approve(f.id)}>
              Approve
            </button> */}
            <button className="btn btn-delete" onClick={() => remove(f.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ── APPROVED ── */}
      {/* <p className="section-label">Approved</p>

      {approvedList.length === 0 && (
        <p className="empty-msg">No approved feedbacks</p>
      )} */}

      {approvedList.map(f => (
        <div key={f.id} className="feedback-card approved">
          <div className="card-top">
            <span className="customer-name">{f.name}</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="rating-badge">★ {f.rating}</span>
              <span className="status-pill status-approved">Approved</span>
            </div>
          </div>

          <p className="service-tag">{f.services?.join(", ")}</p>
          <p className="suggestion-text">{f.suggestion}</p>
          <p className="feedback-date">{new Date(f.created_at).toLocaleString()}</p>

          <hr className="card-divider" />

          <div className="action-row">
            <button className="btn btn-delete" onClick={() => remove(f.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}