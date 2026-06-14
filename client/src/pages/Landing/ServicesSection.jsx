import React, { useEffect, useRef } from "react";
import "./services.css";

const services = [
  {
    icon: "👤",
    title: "Customer Management",
    desc: "Manage customer profiles, order history and communication from a single dashboard.",
    tag: "CRM",
  },
  {
    icon: "📦",
    title: "Order Tracking",
    desc: "Track every laundry order from pickup to delivery with real-time updates.",
    tag: "Live",
  },
  {
    icon: "🧾",
    title: "Smart Billing",
    desc: "Generate invoices instantly with discounts, extra charges and payment tracking.",
    tag: "Auto",
  },
  {
    icon: "🚚",
    title: "Pickup & Delivery",
    desc: "Schedule pickups and deliveries while keeping customers informed at every step.",
    tag: "Logistics",
  },
  {
    icon: "📱",
    title: "WhatsApp Notifications",
    desc: "Send automated updates for pickup, processing and delivery via WhatsApp Business API.",
    tag: "Automated",
  },
  {
    icon: "📊",
    title: "Business Analytics",
    desc: "Monitor revenue, customer growth and order performance with powerful insights.",
    tag: "Insights",
  },
];

const benefits = [
  {
    title: "For Customers",
    accent: "#0ea5e9",
    accentLight: "#e0f2fe",
    items: [
      "Easy Order Tracking",
      "Real-Time Notifications",
      "Fast Pickup & Delivery",
      "Secure Billing & Receipts",
    ],
  },
  {
    title: "For Laundry Owners",
    accent: "#6366f1",
    accentLight: "#eef2ff",
    items: [
      "Manage Customers Easily",
      "Generate Bills Instantly",
      "Track Revenue & Orders",
      "Automate Daily Operations",
    ],
  },
];

export default function ServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("svs-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const animatedEls = sectionRef.current?.querySelectorAll(".svs-animate");
    animatedEls?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="svs-section" ref={sectionRef}>

      {/* Decorative background blobs */}
      <div className="svs-bg-blob svs-blob-1" aria-hidden="true" />
      <div className="svs-bg-blob svs-blob-2" aria-hidden="true" />

      {/* Header */}
      <div className="svs-header svs-animate">
  <span className="svs-eyebrow">Our Services</span>
  <h2 className="svs-heading">
    What We{" "}
    <span className="svs-heading-accent">Offer</span>
  </h2>
  <p className="svs-subheading">
    From smart billing to real-time order tracking — we provide everything
    a modern laundry business needs to run smoothly and keep customers happy.
  </p>
</div>

      {/* Services Grid */}
      <div className="svs-grid">
        {services.map((service, i) => (
          <div
            className="svs-card svs-animate"
            key={i}
            style={{ "--delay": `${i * 80}ms` }}
          >
            <div className="svs-card-top">
              <div className="svs-icon-wrap">
                <span className="svs-icon">{service.icon}</span>
              </div>
              <span className="svs-tag">{service.tag}</span>
            </div>
            <h3 className="svs-card-title">{service.title}</h3>
            <p className="svs-card-desc">{service.desc}</p>
            <div className="svs-card-line" aria-hidden="true" />
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="svs-benefits-wrapper">
        {benefits.map((b, i) => (
          <div
            className="svs-benefit-card svs-animate"
            key={i}
            style={{
              "--accent": b.accent,
              "--accent-light": b.accentLight,
              "--delay": `${i * 120}ms`,
            }}
          >
            <div className="svs-benefit-header">
              <div className="svs-benefit-dot" aria-hidden="true" />
              <h3 className="svs-benefit-title">{b.title}</h3>
            </div>
            <ul className="svs-benefit-list">
              {b.items.map((item, j) => (
                <li key={j} className="svs-benefit-item" style={{ "--item-delay": `${j * 60}ms` }}>
                  <span className="svs-check" aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </section>
  );
}