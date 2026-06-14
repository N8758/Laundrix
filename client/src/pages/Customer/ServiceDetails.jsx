// client/src/pages/Customer/ServiceDetails.jsx
import React, { useEffect, useState } from "react";
import BookService from "./BookService";
import "./style/ServiceDetails.css";

const BASE_URL = process.env.REACT_APP_API_URL;

export default function ServiceDetails({ ownerId, showBooking = false }) {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, [ownerId]);

  async function fetchServices() {
    const res = await fetch(`${BASE_URL}/api/customer/owner/${ownerId}/services`);
    if (!res.ok) return setServices([]);
    const data = await res.json();
    setServices(data.services || []);
  }

  if (!services.length) {
    return (
      <div className="services-empty">
        <span>🧺</span>
        No services available.
      </div>
    );
  }

  return (
    <div>
      <h3 className="services-title">
        {showBooking ? "Book a Service" : "Services"}
      </h3>

      <div className="services-grid">
        {services.map((s) => (
          <div key={s.id} className="service-card">

            {/* Title */}
            <p className="service-card__title">{s.title}</p>

            {/* Category */}
            <span className="service-card__category">{s.category}</span>

            {/* Description */}
            <p className="service-card__desc">{s.desc}</p>

            {s.gst > 0 && (
  <p style={{ fontSize: "12px", color: "gray" }}>
    GST: {s.gst}%
  </p>
)}

            {/* Per KG Pricing */}
            {s.pricingType === "perKg" && (
  <p className="service-card__price">
    ₹{s.pricePerKg} + {s.gst}% GST = ₹
    {(
      Number(s.pricePerKg) +
      (Number(s.pricePerKg) * Number(s.gst) / 100)
    ).toFixed(2)} per KG
  </p>
)}

            {/* Per Item Pricing */}
            {s.pricingType === "perItem" && (
              <ul className="service-card__items">
                {s.itemPrices.map((p, i) => (
                  <li key={i}>
                    <span>{p.item}</span>
                    <span>
  ₹{p.price} + {s.gst}% GST = ₹
  {(
    Number(p.price) +
    (Number(p.price) * Number(s.gst) / 100)
  ).toFixed(2)}
</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Image */}
            {s.imageUrl && (
  <img
    src={`${BASE_URL}/${s.imageUrl}`}
    alt="service"
    className="service-card__image"
  />
)}

            {/* Booking UI — only in Book tab */}
            {showBooking && (
              <BookService service={s} ownerId={ownerId} />
            )}

          </div>
        ))}
      </div>
    </div>
  );
}