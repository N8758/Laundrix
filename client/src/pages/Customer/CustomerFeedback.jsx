// client/src/pages/Customer/CustomerFeedback.jsx

import React, { useState, useEffect } from "react";
import "./style/CustomerFeedback.css";

export default function CustomerFeedback({ ownerId }) {
  const [name, setName] = useState("");
  const [services, setServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [rating, setRating] = useState(5);
  const [suggestion, setSuggestion] = useState("");
  const [message, setMessage] = useState("");

  const BASE_URL = process.env.REACT_APP_API_URL;

  // 🔹 Fetch customer name
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("customerToken");

        const res = await fetch(`${BASE_URL}/api/customer/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setName(data.customer.name);
        }
      } catch (err) {
        console.error("Error fetching user", err);
      }
    };

    fetchUser();
  }, []);

  // 🔹 Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/customer/owner/${ownerId}/services`);
        const data = await res.json();
        setServiceOptions(data.services || []);
      } catch (err) {
        console.error("Error fetching services", err);
      }
    };

    if (ownerId) fetchServices();
  }, [ownerId]);

  // 🔹 Submit feedback
  const submit = async (e) => {
    e.preventDefault();

    if (services.length === 0) {
      setMessage("Please select at least one service");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/feedback/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("customerToken")}`
        },
        body: JSON.stringify({
          ownerId,
          name,
          services,
          rating,
          suggestion
        })
      });

      const body = await res.json();

      if (res.ok) {
        setMessage("Feedback submitted successfully ✅");
        setServices([]);
        setRating(5);
        setSuggestion("");
      } else {
        setMessage(body.message || "Something went wrong");
      }

    } catch (e) {
      setMessage("Server error");
    }
  };

  return (
    <div className="feedback-container">
      <h3 className="feedback-title">Give Feedback</h3>

      <form onSubmit={submit} className="feedback-form">

        <label>Your Name</label>
        <input
          className="feedback-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Select Services</label>
        <div className="services-box">
          {serviceOptions.map((s) => (
            <div key={s.id} className="service-item">
              <input
                type="checkbox"
                value={s.title}
                checked={services.includes(s.title)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setServices([...services, s.title]);
                  } else {
                    setServices(services.filter(item => item !== s.title));
                  }
                }}
              />
              <span style={{ marginLeft: "8px" }}>{s.title}</span>
            </div>
          ))}
        </div>

        <label>Rating</label>
        <select
          className="feedback-select"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5,4,3,2,1].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <label>Suggestion</label>
        <textarea
          className="feedback-textarea"
          value={suggestion}
          onChange={(e) => setSuggestion(e.target.value)}
        />

        <button type="submit" className="feedback-btn">
          Submit Feedback
        </button>
      </form>

      {message && <p className="feedback-message">{message}</p>}
    </div>
  );
}