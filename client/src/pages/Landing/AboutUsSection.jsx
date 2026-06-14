import React, { useEffect, useRef } from "react";
import "./about.css";

export default function AboutUsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("abt-visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    const els = sectionRef.current?.querySelectorAll(".abt-animate");
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="abt-section" ref={sectionRef}>

      <div className="abt-bg-blob abt-blob-1" aria-hidden="true" />
      <div className="abt-bg-blob abt-blob-2" aria-hidden="true" />

      <div className="abt-container">

        {/* Left Content */}
        <div className="abt-left">

          <span className="abt-eyebrow abt-animate">About Us</span>

          <h2 className="abt-heading abt-animate" style={{ "--delay": "80ms" }}>
            Transforming Laundry Businesses Through
            <span className="abt-heading-accent"> Smart Technology</span>
          </h2>

          <p className="abt-para abt-animate" style={{ "--delay": "140ms" }}>
            Our Laundry Management System is designed to simplify daily
            operations for laundry owners while providing a seamless
            experience for customers — all from one powerful platform.
          </p>

          <p className="abt-para abt-animate" style={{ "--delay": "180ms" }}>
            From order management and customer tracking to smart billing,
            WhatsApp notifications and home delivery — every aspect of your
            laundry business is covered in a single dashboard.
          </p>

          <p className="abt-para abt-animate" style={{ "--delay": "220ms" }}>
            Whether you run a single shop or manage multiple branches, our
            solution improves efficiency, reduces manual work and keeps
            your customers happy.
          </p>

          <div className="abt-stats abt-animate" style={{ "--delay": "280ms" }}>
            <div className="abt-stat">
              <span className="abt-stat-value">100%</span>
              <span className="abt-stat-label">Digital Management</span>
            </div>
            <div className="abt-stat-divider" aria-hidden="true" />
            <div className="abt-stat">
              <span className="abt-stat-value">24/7</span>
              <span className="abt-stat-label">System Access</span>
            </div>
            <div className="abt-stat-divider" aria-hidden="true" />
            <div className="abt-stat">
              <span className="abt-stat-value">Fast</span>
              <span className="abt-stat-label">Order Processing</span>
            </div>
          </div>

        </div>

        {/* Right Image */}
        <div className="abt-right abt-animate" style={{ "--delay": "100ms" }}>
          <div className="abt-img-wrapper">
            <img
              src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=700&q=80"
              alt="Laundry Management System"
              className="abt-img"
            />
            <div className="abt-img-overlay" aria-hidden="true" />

            {/* Floating badge */}
            <div className="abt-badge">
              <span className="abt-badge-icon">✅</span>
              <div>
                <p className="abt-badge-title">Trusted Platform</p>
                <p className="abt-badge-sub">Built for laundry owners</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
}