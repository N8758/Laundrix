import React, { useEffect, useState } from "react";
import "./style/OwnerBookings.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function OwnerBookings({ ownerId }) {
  const [bookings, setBookings] = useState([]);
  const [pickupTime, setPickupTime] = useState({});
  const [activeTab, setActiveTab] = useState("self");
  const [weightInput, setWeightInput] = useState({});
  const [staffList, setStaffList] = useState([]);
  const [showReschedule, setShowReschedule] = useState({});
const [rescheduleTime, setRescheduleTime] = useState({});
const [rescheduleBooking, setRescheduleBooking] = useState(null);

  useEffect(() => {
    if (!ownerId) return;
    fetchBookings();
    fetchStaff();
  }, [ownerId]);

  const fetchStaff = async () => {
  const res = await fetch(
    `${process.env.REACT_APP_API_URL}/api/owner/staff/${ownerId}`
  );
  const data = await res.json();
  setStaffList(data || []);
};

const assignStaff = async (bookingId, staff_id, type) => {
  await fetch(
    `${process.env.REACT_APP_API_URL}/api/booking/owner/assign-staff`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, staff_id, type }),
    }
  );

  alert("Staff assigned successfully");
  fetchBookings();
};

  const fetchBookings = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/api/booking/owner/${ownerId}`
    );
    const data = await res.json();
    setBookings(data.bookings || []);
  };

  const confirmBooking = async (bookingId) => {
    if (!pickupTime[bookingId]) {

      const selected = new Date(pickupTime[bookingId]);

if (selected <= new Date()) {
  alert("Please select a future date and time");
  return;
}
      alert("Please select pickup date & time");
      return;
    }
    await fetch(`${process.env.REACT_APP_API_URL}/api/booking/owner/confirm`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, pickupDateTime: pickupTime[bookingId] })
    });
    alert("Pickup notification sent successfully ✅");
    fetchBookings();
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Delete this booking permanently?")) return;
    await fetch(
      `${process.env.REACT_APP_API_URL}/api/booking/owner/hide/${bookingId}`,
      { method: "PATCH" }
    );
    fetchBookings();
  };

  const selfBookings = bookings.filter(b => (b.pickupType || "self") === "self");
  const doorBookings = bookings.filter(b => b.pickupType === "door");

  if (!bookings.length) return <p>No bookings yet</p>;

  return (
    <div className="bookings-root">

      <div className="tab-group">
        <button
          className={`tab-btn ${activeTab === "self" ? "tab-self-active" : "tab-self-inactive"}`}
          onClick={() => setActiveTab("self")}
        >
          Self Orders
        </button>
        <button
          className={`tab-btn ${activeTab === "door" ? "tab-door-active" : "tab-door-inactive"}`}
          onClick={() => setActiveTab("door")}
        >
          Door Orders
        </button>
      </div>

      <h3 className="section-title">Customer Bookings</h3>

      {(activeTab === "self" ? selfBookings : doorBookings).map(b => (
        <div
          key={b.bookingId}
          className={`booking-card ${b.pickupType === "door" ? "door" : ""}`}
        >
          <div className="card-header">

            <div style={{ marginTop: "10px" }}>
  {b.items?.map((service, index) => (
  <div key={index} style={{ marginBottom: "10px" }}>

    <strong>{service.serviceName}</strong>

    {service.items?.length > 0 ? (
  service.items.map((item, i) => (
    <div key={i} style={{ marginLeft: "10px" }}>
      {item.name} × {item.quantity}
    </div>
  ))
) : (
  <div style={{ marginLeft: "10px", color: "orange" }}>
    {service.weight ? `${service.weight} kg` : "Weight pending"}
  </div>
)}

    {/* ✅ WEIGHT INPUT PER SERVICE */}
    {(b.status === "pending_weight" || b.status === "PENDING_WEIGHT") && (!service.items || service.items.length === 0) && (
      <>
        <input
          type="number"
          placeholder="Enter weight (kg)"
          className="dt-input"
          value={weightInput[`${b.bookingId}_${index}`] || ""}
          onChange={(e) =>
            setWeightInput({
              ...weightInput,
              [`${b.bookingId}_${index}`]: e.target.value,
            })
          }
        />

        <button
          className="btn btn-confirm"
          onClick={async () => {
            const kg = weightInput[`${b.bookingId}_${index}`];
            if (!kg) return alert("Enter weight");

            await fetch(
              `${process.env.REACT_APP_API_URL}/api/booking/owner/update-weight/${b.bookingId}`,
              {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  serviceIndex: index,
                  weight: kg,
                }),
              }
            );

            fetchBookings();
          }}
        >
          Submit
        </button>
      </>
    )}

  </div>
))}
</div>
            
            <span className={`status-badge status-${b.status}`}>
  {b.status.toLowerCase() === "completed"
    ? "DELIVERED"
    : b.status.toUpperCase()}
</span>
          </div>

          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">Customer</span>
              <span className="info-value">{b.customerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Mobile</span>
              <span className="info-value">{b.customerMobile}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Address</span>
              <span className="info-value">{b.customerAddress}</span>
            </div>

            {b.latitude && b.longitude && (
  <div className="info-row">
    <span className="info-label">Map</span>
    <a
      href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`}
      target="_blank"
      rel="noreferrer"
      style={{ color: "blue" }}
    >
      Open in Google Maps 📍
    </a>
  </div>
)}

            <div className="info-row">
              <span className="info-label">Total</span>
              {b.status === "pending_weight" ? (
  <span className="info-value info-price">
  ₹{Number(b.totalPrice || 0).toFixed(2)}
</span>
) : (
  <span className="info-value info-price">
  ₹{Number(b.totalPrice || 0).toFixed(2)}
</span>
)}
            </div>
           <div className="info-row info-full">
  <span className="info-label">Order Date</span>
  <span className="info-value">
    {new Date(b.createdAt).toLocaleString()}
  </span>
</div>

</div>


{b.customerCancelRequest && (
<div className="customer-cancel-request">

<h4>❌ Customer Cancel Request</h4>

<p>
Reason: {b.customerCancelReason}
</p>

</div>
)}



{b.customerRescheduleRequest && (
<div className="customer-reschedule-request">

<h4>⟳ Customer Reschedule Request</h4>

<p>
New Date:
{
b.status === "processing"
  ? (
      b.completionDateTime
        ? new Date(b.completionDateTime).toLocaleString()
        : "-"
    )
  : (
      b.pickupDateTime
        ? new Date(b.pickupDateTime).toLocaleString()
        : "-"
    )
}
</p>

<p>
Reason: {b.customerRescheduleReason}
</p>

</div>
)}

<hr className="card-divider" />

          <div className="action-row">

            {/* ✅ ASSIGN STAFF (ONLY DOOR ORDERS) */}
{/* ✅ PICKUP STAFF */}
{b.pickupType === "door" &&
 (b.status === "pending_weight" || b.status === "assigned") && (
  <select
    className="dt-input"
    onChange={(e) => assignStaff(b.bookingId, e.target.value, "pickup")}
    defaultValue=""
  >
    <option value="" disabled>Select Pickup Staff</option>
    {staffList.map((s) => (
      <option key={s.staff_id} value={s.staff_id}>
        {s.name}
      </option>
    ))}
  </select>
)}

{/* ✅ DELIVERY STAFF */}
{b.pickupType === "door" &&
 (b.status === "accepted" || b.status === "processing") && (
  <select
    className="dt-input"
    onChange={(e) => assignStaff(b.bookingId, e.target.value, "delivery")}
    defaultValue=""
  >
    <option value="" disabled>Select Delivery Staff</option>
    {staffList.map((s) => (
      <option key={s.staff_id} value={s.staff_id}>
        {s.name}
      </option>
    ))}
  </select>
)}


            {/* DOOR ORDER - CONFIRM PICKUP */}
            {(  b.status === "assigned") 
&& b.pickupType === "door" && (
              <>
                <DatePicker
  selected={pickupTime[b.bookingId] || null}
  onChange={(date) =>
    setPickupTime({
      ...pickupTime,
      [b.bookingId]: date,
    })
  }
  showTimeSelect
  minDate={new Date()}
  minTime={
    pickupTime[b.bookingId] &&
    pickupTime[b.bookingId].toDateString() === new Date().toDateString()
      ? new Date()
      : new Date(0, 0, 0, 0, 0)
  }
  maxTime={new Date(0, 0, 0, 23, 59)}
  timeFormat="hh:mm aa"
  timeIntervals={30}
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="dt-input"
/>
                <button className="btn btn-confirm" onClick={() => confirmBooking(b.bookingId)}>
                  Confirm Pickup
                </button>
              </>
            )}

            {/* SELF ORDER - COMPLETE */}
            {( b.status === "accepted" ) && b.pickupType === "self" && (
              <>
               <DatePicker
  selected={pickupTime[b.bookingId] || null}
  onChange={(date) =>
    setPickupTime({
      ...pickupTime,
      [b.bookingId]: date,
    })
  }
  showTimeSelect
  minDate={new Date()}
  minTime={
    pickupTime[b.bookingId] &&
    pickupTime[b.bookingId].toDateString() === new Date().toDateString()
      ? new Date()
      : new Date(0, 0, 0, 0, 0)
  }
  maxTime={new Date(0, 0, 0, 23, 59)}
  timeFormat="hh:mm aa"
  timeIntervals={30}
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="dt-input"
/>
                <button
                  className="btn btn-complete"
                  onClick={async () => {
                    if (!pickupTime[b.bookingId]) {
                      const selected = new Date(pickupTime[b.bookingId]);

if (selected <= new Date()) {
  alert("Please select a future date and time");
  return;
}
                      alert("Select completion date & time");
                      return;
                    }
                    await fetch(`${process.env.REACT_APP_API_URL}/api/booking/owner/complete`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ bookingId: b.bookingId, completionDateTime: pickupTime[b.bookingId] })
                    });
                    alert("Self order delivered.");
                    fetchBookings();
                  }}
                >
                  Deliver Order
                </button>
              </>
            )}

            {/* DOOR ORDER - MARK COMPLETED */}
            {/* DOOR ORDER - MARK COMPLETED */}
{(b.status === "processing" || b.status === "accepted")
  && b.pickupType === "door" && (
              <>
               <DatePicker
  selected={pickupTime[b.bookingId] || null}
  onChange={(date) =>
    setPickupTime({
      ...pickupTime,
      [b.bookingId]: date,
    })
  }
  showTimeSelect
  minDate={new Date()}
  minTime={
    pickupTime[b.bookingId] &&
    pickupTime[b.bookingId].toDateString() === new Date().toDateString()
      ? new Date()
      : new Date(0, 0, 0, 0, 0)
  }
  maxTime={new Date(0, 0, 0, 23, 59)}
  timeFormat="hh:mm aa"
  timeIntervals={30}
  dateFormat="dd/MM/yyyy hh:mm aa"
  placeholderText="Select Date & Time"
  className="dt-input"
/>
                <button
                  className="btn btn-complete"
                  onClick={async () => {
                    if (!pickupTime[b.bookingId]) {

                      const selected = new Date(pickupTime[b.bookingId]);

if (selected <= new Date()) {
  alert("Please select a future date and time");
  return;
}
                      alert("Select completion date & time");
                      return;
                    }
                    await fetch(`${process.env.REACT_APP_API_URL}/api/booking/owner/complete`, {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ bookingId: b.bookingId, completionDateTime: pickupTime[b.bookingId] })
                    });
                    alert("Order delivered successfully.");
                    fetchBookings();
                  }}
                >
                  Mark Delivered
                </button>
              </>
            )}

            {/* CANCEL, RESCHEDULE, DELETE */}
{b.pickupType === "door" &&
 !["delivered", "cancelled"].includes(b.status) && (
              <>
                <button
                  className="btn btn-cancel"
                  onClick={async () => {
                    const reason = prompt("Enter cancel reason");
                    if (!reason) return;
                    await fetch(
                      `${process.env.REACT_APP_API_URL}/api/booking/owner/cancel/${b.bookingId}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ reason })
                      }
                    );

                    alert("Booking cancelled successfully ✅");
                    fetchBookings();
                  }}
                >
                  Cancel
                </button>

                <button
  className="btn btn-reschedule"
  onClick={() => setRescheduleBooking(b)}
>
  Reschedule
</button>

                <button
                  className="btn btn-delete"
                  onClick={() => deleteBooking(b.bookingId)}
                >
                  Delete
                </button>
              </>
            )}

          </div>
        </div>
           ))}

      {rescheduleBooking && (
        <div className="reschedule-overlay">
          <div className="reschedule-modal">

            <DatePicker
              selected={
                rescheduleTime[rescheduleBooking.bookingId] || null
              }
              onChange={(date) =>
                setRescheduleTime({
                  ...rescheduleTime,
                  [rescheduleBooking.bookingId]: date,
                })
              }
              showTimeSelect
              minDate={new Date()}
              dateFormat="dd/MM/yyyy hh:mm aa"
              className="dt-input"
            />

            <br /><br />

            <button
              className="btn btn-cancel"
              onClick={() => setRescheduleBooking(null)}
            >
              Close
            </button>

            <button
              className="btn btn-reschedule"
              onClick={async () => {
                const reason = prompt("Enter reschedule reason");
                if (!reason) return;

                await fetch(
                  `${process.env.REACT_APP_API_URL}/api/booking/owner/reschedule/${rescheduleBooking.bookingId}`,
                  {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      newDate:
                        rescheduleTime[
                          rescheduleBooking.bookingId
                        ],
                      reason,
                    }),
                  }
                );
                alert("Booking rescheduled successfully ✅");

                setRescheduleBooking(null);
                fetchBookings();
              }}
            >
              Save
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

