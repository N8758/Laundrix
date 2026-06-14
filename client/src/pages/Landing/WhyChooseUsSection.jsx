import React, { useEffect, useRef } from "react";
import "./whychoose.css";

const reasons = [
  { icon: "🏢", title: "All-In-One Platform", desc: "Manage customers, orders, billing, deliveries and notifications from a single system.", num: "01" },
  { icon: "⚡", title: "Save Time", desc: "Reduce manual work and automate daily laundry operations efficiently.", num: "02" },
  { icon: "😊", title: "Better Customer Experience", desc: "Provide customers with faster service, real-time updates and smooth communication.", num: "03" },
  { icon: "📈", title: "Business Growth", desc: "Track performance, revenue and customer engagement to grow your laundry business.", num: "04" },
  { icon: "🔒", title: "Secure & Reliable", desc: "Built with secure access controls and reliable data management.", num: "05" },
  { icon: "🚀", title: "Scalable Solution", desc: "Suitable for both small laundry shops and expanding laundry businesses.", num: "06" },
];

const stats = [
  { value: "24/7", label: "System Availability" },
  { value: "100%", label: "Digital Management" },
  { value: "Fast", label: "Order Processing" },
  { value: "Secure", label: "Data Protection" },
];

export default function WhyChooseUsSection() {
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("wc-in")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".wc-anim").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="whychoose" className="wc-section" ref={ref}>
      <div className="wc-noise" />
      <div className="wc-blob wc-blob1" />
      <div className="wc-blob wc-blob2" />
      <div className="wc-blob wc-blob3" />

      <div className="wc-wrap">
        {/* Header */}
        <div className="wc-header wc-anim">
          <div className="wc-eyebrow">
            <span className="wc-dot" />
            Why Choose Us
            <span className="wc-dot" />
          </div>
          <h2 className="wc-h2">
            The Smarter Way To<br />
            <em className="wc-em">Manage Your Laundry</em>
          </h2>
          <p className="wc-lead">
            Designed to simplify operations, improve customer satisfaction
            and help laundry businesses grow faster.
          </p>
        </div>

        {/* Grid */}
        <div className="wc-grid">
          {reasons.map((r, i) => (
            <div className="wc-card wc-anim" key={i} style={{ "--i": i }}>
              <span className="wc-num">{r.num}</span>
              <div className="wc-icon">{r.icon}</div>
              <h3 className="wc-card-h">{r.title}</h3>
              <p className="wc-card-p">{r.desc}</p>
              <div className="wc-arrow">→</div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="wc-stats wc-anim">
          {stats.map((s, i) => (
            <div className="wc-stat" key={i}>
              <strong className="wc-stat-v">{s.value}</strong>
              <span className="wc-stat-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}