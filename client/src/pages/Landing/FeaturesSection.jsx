import React, { useEffect, useRef } from "react";
import "./features.css";

const features = [
  {
    icon: "📲",
    title: "Instant Order Updates",
    desc: "Customers receive live WhatsApp notifications at every step — from pickup confirmation to delivery.",
  },
  {
    icon: "🧺",
    title: "Track Your Laundry Live",
    desc: "Check order status anytime — Pending, Processing, Ready or Out for Delivery.",
  },
  {
    icon: "🧾",
    title: "Digital Receipts & Bills",
    desc: "Get a clean itemized invoice instantly — no paper, no confusion, always accessible.",
  },
  {
    icon: "🚪",
    title: "Doorstep Pickup & Drop",
    desc: "Schedule a home pickup and delivery — laundry collected and returned without stepping out.",
  },
  {
    icon: "📋",
    title: "Full Order History",
    desc: "Every order ever placed — filter by date, status or customer with one click.",
  },
  {
    icon: "💰",
    title: "Revenue at a Glance",
    desc: "Track daily, weekly and monthly revenue with clear visual reports and trends.",
  },
  {
    icon: "👥",
    title: "Manage Your Team",
    desc: "Assign staff to orders, control access levels and monitor daily team activity.",
  },
  {
    icon: "⚙️",
    title: "Automate Daily Operations",
    desc: "Billing, notifications and status updates run automatically — no manual follow-ups needed.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fts-visible");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" }
    );

    const els = sectionRef.current?.querySelectorAll(".fts-animate");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="fts-section" ref={sectionRef}>

      <div className="fts-bg-blob fts-blob-1" aria-hidden="true" />
      <div className="fts-bg-blob fts-blob-2" aria-hidden="true" />

      <div className="fts-header fts-animate">
        <span className="fts-eyebrow">Platform Capabilities</span>
        <h2 className="fts-heading">
          Powerful Features{" "}
          <span className="fts-heading-accent">For Everyone</span>
        </h2>
        <p className="fts-subheading">
          Every tool your laundry business needs — and everything customers
          love — built into one seamless platform.
        </p>
      </div>

      <div className="fts-grid">
        {features.map((f, i) => (
          <div
            className="fts-card fts-animate"
            key={i}
            style={{ "--delay": `${i * 70}ms` }}
          >
            <div className="fts-icon-wrap">
              <span className="fts-icon">{f.icon}</span>
            </div>
            <h3 className="fts-card-title">{f.title}</h3>
            <p className="fts-card-desc">{f.desc}</p>
            <div className="fts-card-line" aria-hidden="true" />
          </div>
        ))}
      </div>

    </section>
  );
}