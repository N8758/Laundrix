// client/src/pages/Customer/BookService.jsx
import React, { useEffect, useState } from "react";
import "./style/BookService.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";



export default function BookService({ ownerId }) {
  const [customer, setCustomer] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [qty, setQty] = useState({});
  const [cart, setCart] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [orderFilter, setOrderFilter] = useState("self");
  const [pickupType, setPickupType] = useState("self");
  const [owner, setOwner] = useState(null);
  const [customerAddress, setCustomerAddress] = useState("");
  const [showReschedule, setShowReschedule] = useState({});
const [rescheduleTime, setRescheduleTime] = useState({});

  /* LOAD SERVICES */
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/customer/owner/${ownerId}/services`)
      .then((res) => res.json())
      .then((data) => setServices(data.services || []));
  }, [ownerId]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/customer/owner/${ownerId}`)
      .then((res) => res.json())
      .then((data) => setOwner(data.owner));
  }, [ownerId]);

  useEffect(() => {
    fetchCustomer();
    fetchBookings();
  }, []);

  async function fetchCustomer() {
    try {
      const token = localStorage.getItem("customerToken");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/customer/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCustomer(data.customer);
      setCustomerAddress(data.customer.address || "");
    } catch (err) {
      console.log("Error fetching customer");
    }
  }

  const selectedService = services.find((s) => s.id === selectedServiceId);

  /* CALCULATE TOTAL */
 const calculateTotal = () => {
  if (!selectedService) return 0;

  if (selectedService.pricingType === "perItem") {
    return selectedService.itemPrices.reduce((sum, item) => {
      const key = `${selectedService.id}_${item.item}`;
      const quantity = Number(qty[key] || 0);

      const gst = Number(selectedService.gst) || 0;
      const priceWithGst =
        Number(item.price) + (Number(item.price) * gst / 100);

      return Number(sum + quantity * priceWithGst);
    }, 0);
  }

  return 0; // for perKg
};

  /* ADD TO CART */
  const addToCart = () => {
    if (!selectedService) return;

    let structuredItems = [];
    let total = 0;

    if (selectedService.pricingType === "perKg") {
  structuredItems.push({
    name: selectedService.title,
    quantity: 0,
    unitPrice: selectedService.pricePerKg,
    amount: 0,
  });
  total = 0;
}

    if (selectedService.pricingType === "perItem") {
      selectedService.itemPrices.forEach((item) => {
        const key = `${selectedService.id}_${item.item}`;
        const q = Number(qty[key] || 0);
        if (q > 0) {
          const gst = Number(selectedService.gst) || 0;

const priceWithGst =
  Number(item.price) + (Number(item.price) * gst / 100);

const amount = q * priceWithGst;
          structuredItems.push({ name: item.item, quantity: q, unitPrice: item.price, amount });
          total += amount;
        }
      });
      if (structuredItems.length === 0) return alert("Enter valid quantity");
    }

    setCart([
      ...cart,
      {
        id: `TMP${Date.now()}`,
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        pricingType: selectedService.pricingType,
        items: structuredItems,
        totalPrice: total,
      },
    ]);

    setQty({});
    setSelectedServiceId("");
  };

  /* CONFIRM BOOKINGS */
  const confirmBookings = async () => {
  if (!customerAddress && pickupType === "door") {
  alert("Please add address in Profile section");
  return;
}

  const res = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
    },
    body: JSON.stringify({
      ownerId,
      services: cart.map((b) => ({
        serviceId: b.serviceId,
        serviceName: b.serviceName,
        items: b.items,
      })),
      customerAddress,
      pickupType,
      deliveryCharge: pickupType === "door" ? owner?.door_charge || 0 : 0,
    }),
  });

  alert("Booking placed successfully");
  setCart([]);
  fetchBookings();
};

 



  const fetchBookings = async () => {
    const token = localStorage.getItem("customerToken");
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/booking/customer/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMyBookings(data.bookings || []);
  };

  /* STATUS CLASS HELPER */
  const statusClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "pending")     return "order-status pending";
    if (s === "confirmed")   return "order-status confirmed";
    if (s === "cancelled")   return "order-status cancelled";
    if (s === "delivered")   return "order-status completed";
    if (s === "rescheduled") return "order-status rescheduled";
    return "order-status pending";
  };

  const filteredBookings = myBookings.filter(
  (b) => b.pickupType === orderFilter
);

  return (
    <div>
      {/* ── BOOK SERVICE ── */}
      <h3 className="book-title">Book a Service</h3>

      {/* Service Selector */}
      <select
        className="book-select"
        value={selectedServiceId}
        onChange={(e) => setSelectedServiceId(e.target.value)}
      >
        <option value="">Select Service</option>
        {services.map((s) => (
          <option
  key={s.id}
  value={s.id}
  disabled={cart.some(c => c.serviceId === s.id)}
>
  {s.title} {cart.some(c => c.serviceId === s.id) ? "(Added)" : ""}
</option>
        ))}
      </select>

      {/* Selected Service Card */}
      {selectedService && (
        <div className="book-service-card">
          <h4>{selectedService.title}</h4>

          {/* Per KG */}
          {selectedService.pricingType === "perKg" && (
  <>
    <p>
  Price: ₹{selectedService.pricePerKg} + {selectedService.gst}% GST = ₹
  {(
    Number(selectedService.pricePerKg) +
    (Number(selectedService.pricePerKg) * Number(selectedService.gst || 0) / 100)
  ).toFixed(2)} / kg
</p>
    <p>Owner will confirm final weight & price</p>
  </>
)}

          {/* Per Item */}
          {selectedService.pricingType === "perItem" && (
            <table className="book-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedService.itemPrices.map((item) => {
                  const key = `${selectedService.id}_${item.item}`;
                  const quantity = Number(qty[key] || 0);
                  const gst = Number(selectedService.gst) || 0;
  const priceWithGst =
    Number(item.price) + (Number(item.price) * gst / 100);

  const amount = quantity * priceWithGst;
                  return (
                    <tr key={item.item}>
                      <td>{item.item}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={quantity}
                          onChange={(e) =>
                            setQty({ ...qty, [key]: e.target.value })
                          }
                        />
                      </td>
                      <td>
  ₹{item.price} + {selectedService.gst}% GST = ₹
  {(
    Number(item.price) +
    (Number(item.price) * Number(selectedService.gst || 0) / 100)
  ).toFixed(2)}
</td>
                      <td>₹{amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Total */}
<div className="book-total">
  <span>Total</span>

  {selectedService.pricingType === "perKg" ? (
    <span>Price will be confirmed by owner</span>
  ) : (
    <span>
      ₹{Number(calculateTotal()).toFixed(2)}

      {pickupType === "door" &&
        ` + Door Charge ₹${Number(owner?.door_charge || 0)}`}
    </span>
  )}
</div>

          <button className="btn-add-cart" onClick={addToCart}>
            + Add to Cart
          </button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
  <h4>Selected Services</h4>

  {cart.map((c, index) => (
    <div key={index} style={{
      border: "1px solid #ddd",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "8px"
    }}>
      
      <strong>{c.serviceName}</strong>

      {c.pricingType === "perKg" ? (
        <p style={{ color: "orange" }}>
          Price will be calculated after weight
        </p>
      ) : (
        c.items.map((item, i) => (
          <div key={i}>
            {item.name} × {item.quantity} — ₹{Number(item.amount).toFixed(2)}
          </div>
        ))
      )}

      <button
        style={{ marginTop: "5px", color: "red" }}
        onClick={() => {
          setCart(cart.filter((_, i) => i !== index));
        }}
      >
        Remove
      </button>

    </div>
  ))}
</div>

      {/* ── CART + CHECKOUT ── */}
      {cart.length > 0 && (
        <div className="pickup-section">
          <h4>Select Pickup Type</h4>
          <div className="pickup-options">
            <label className={`pickup-option ${pickupType === "self" ? "selected" : ""}`}>
              <input
                type="radio"
                value="self"
                checked={pickupType === "self"}
                onChange={() => setPickupType("self")}
              />
              Self Drop
            </label>

            {owner?.door_enabled && (
              <label className={`pickup-option ${pickupType === "door" ? "selected" : ""}`}>
                <input
                  type="radio"
                  value="door"
                  checked={pickupType === "door"}
                  onChange={() => setPickupType("door")}
                />
                Door Pickup (+₹{owner?.door_charge || 0})
              </label>
            )}
          </div>

          <br />

          <textarea
  className="book-address"
  value={customerAddress}
  disabled
  style={{ backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
/>

<p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
  ⚠️ To change address, go to Profile section
</p>

{/* <button
  onClick={() => window.location.href = "/customer/profile"}
  style={{ marginTop: "5px" }}
>
  Edit Address
</button> */}

          <button className="btn-confirm" onClick={confirmBookings}>
            ✓ Confirm Booking
          </button>
        </div>
      )}

     <div className="order-filter-buttons">
  <button
    className={orderFilter === "self" ? "active" : ""}
    onClick={() => setOrderFilter("self")}
  >
    Self Orders
  </button>

  <button
    className={orderFilter === "door" ? "active" : ""}
    onClick={() => setOrderFilter("door")}
  >
    Door Orders
  </button>
</div>

      {/* ── MY ORDERS ── */}
      <h3 className="orders-title">My Orders</h3>

      {filteredBookings.length === 0 && (
        <div className="orders-empty">
          <span>📦</span>
          No orders yet.
        </div>
      )}

      {filteredBookings.map((b) => (
        <div key={b.bookingId} className="order-card">
         

          <div className="order-card__items">
            {b.items?.map((service, index) => (
  <div key={index} style={{ marginBottom: "8px" }}>
    
    <strong>{service.serviceName}</strong>

    {service.items?.map((item, i) => (
      <div key={i} className="order-card__item-row">
        {b.status === "pending_weight" ? (
          <span>Price will be updated after weight</span>
        ) : (
          <span>
            {item.name} × {item.quantity} — ₹{Number(item.amount).toFixed(2)}
          </span>
        )}
      </div>
    ))}

  </div>
))}
          </div>

          <p className="order-card__total">
  {b.status === "pending_weight" ? (
    <span>Price will be calculated after pickup</span>
  ) : (
    <span>Total: ₹{b.totalPrice}</span>
  )}
</p>

          <p className="order-card__meta">
            📅 {new Date(b.createdAt).toLocaleString()}
          </p>

          <span className={statusClass(b.status)}>{b.status}</span>

          {b.cancel_reason && (
            <div className="order-cancel-reason">
              ✕ Cancel Reason: {b.cancel_reason}
            </div>
          )}

         {b.customerRescheduleReason && (
  <div className="order-reschedule-reason">
    ⟳ Reschedule Reason: {b.customerRescheduleReason}
  </div>
)}

          {b.pickupType === "door" &&
 !["cancelled","delivered"].includes(b.status) &&
 !b.customerCancelRequest && (
<div className="order-card__actions">

{showReschedule[b.bookingId] ? (
  <>
    <DatePicker
  selected={rescheduleTime[b.bookingId] || null}
  onChange={(date) =>
    setRescheduleTime({
      ...rescheduleTime,
      [b.bookingId]: date,
    })
  }
  showTimeSelect
  minDate={new Date()}
  minTime={
    rescheduleTime[b.bookingId] &&
    rescheduleTime[b.bookingId].toDateString() === new Date().toDateString()
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
      className="btn-reorder"
      onClick={async () => {
        if (!rescheduleTime[b.bookingId]) {
          alert("Select date & time");
          return;
        }

        const selected = new Date(rescheduleTime[b.bookingId]);

if (selected <= new Date()) {
  alert("Please select a future date and time");
  return;
}


        const reason = prompt("Enter reschedule reason");
        if (!reason) return;

        await fetch(
          `${process.env.REACT_APP_API_URL}/api/booking/customer/reschedule-request/${b.bookingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newDate: rescheduleTime[b.bookingId],
              reason,
            }),
          }
        );

        alert("Reschedule  successfully ✅");

setShowReschedule({
  ...showReschedule,
  [b.bookingId]: false,
});

fetchBookings();
      }}
    >
      Save
    </button>
  </>
) : (
  <button
  className="btn-reorder"
  onClick={() =>
    setShowReschedule({
      ...showReschedule,
      [b.bookingId]: !showReschedule[b.bookingId],
    })
  }
>
  {showReschedule[b.bookingId]
    ? "✕ Close"
    : "⟳ Reschedule"}
</button>
)}


<button
className="btn-delete"
onClick={async()=>{

const reason=prompt(
"Enter cancel reason"
);

if(!reason) return;

await fetch(
`${process.env.REACT_APP_API_URL}/api/booking/customer/cancel-request/${b.bookingId}`,
{
method:"PATCH",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
reason
})
}
);

alert("Cancel request sent");

fetchBookings();

}}
>

✕ Cancel

</button>

</div>
)}

        </div>
        
      ))}
    </div>
  );
}
