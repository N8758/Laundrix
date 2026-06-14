import React, { useEffect, useState } from "react";
import "./PendingOwners.css";

export default function PendingOwners() {

  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    try {

      setLoading(true);

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/pending`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      const data = await res.json();

      setPending(data.pending || []);

    } catch (error) {
      alert("Failed to load pending owners");
      console.log(error);

    } finally {
      setLoading(false);
    }
  }

  async function approve(ownerEmail) {

    try {

      if (!window.confirm("Approve this owner?")) return;

      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/admin/approve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            email: ownerEmail,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Approved Successfully");
        fetchPending();
      } else {
        alert(data.message);
      }

    } catch (error) {
      alert("Something went wrong");
      console.log(error);
    }
  }

  if (loading)
    return <h2 className="loading">Loading...</h2>;

  if (!pending.length)
    return <h2 className="loading">No Pending Owners</h2>;

  return (
    <div className="pending-container">

      <h2 className="pending-title">
        Pending Laundry Owners
      </h2>

      {pending.map((o, i) => (

        <div
          className="pending-card"
          key={i}
        >

          <p>
            <b>{o.shop_name || "—"}</b> — {o.owner_name}
          </p>

          <p>
            Email: {o.email}
          </p>

          <p>
            Mobile: {o.mobile}
          </p>

          <p>
            Address: {o.address}
          </p>

          <button
            className="approve-btn"
            onClick={() => approve(o.email)}
          >
            Approve
          </button>

        </div>

      ))}

    </div>
  );
}