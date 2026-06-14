import React, { useState, useRef, useEffect } from "react";
import "./faq.css";

const faqs = [
  { q: "What is the Laundry Management System?", a: "Laundry Management System is a complete digital platform that helps laundry businesses manage customers, orders, billing, pickups, deliveries and notifications from a single dashboard." },
  { q: "Who can use this platform?", a: "The platform is designed for both laundry owners and customers. Owners can manage operations efficiently, while customers can track orders and receive updates." },
  { q: "Can customers track their laundry orders?", a: "Yes. Customers can easily track the status of their orders from pickup to delivery with real-time updates." },
  { q: "Does the system support WhatsApp notifications?", a: "Yes. Automated WhatsApp notifications keep customers informed about order status, pickups, processing and deliveries." },
  { q: "Can I generate invoices and bills automatically?", a: "Yes. The system provides smart billing with automatic invoice generation, discounts, extra charges and payment tracking." },
  { q: "Does the platform support pickup and delivery management?", a: "Yes. Laundry owners can schedule, manage and monitor pickup and delivery services efficiently." },
  { q: "Is my customer and business data secure?", a: "Yes. The platform uses secure authentication, role-based access control and protected dashboards to keep data safe." },
  { q: "Can laundry owners manage multiple customers and orders?", a: "Absolutely. Owners can manage customers, orders, invoices and service records from one centralized system." },
  { q: "Can I access the system on mobile devices?", a: "Yes. The platform is fully responsive and works seamlessly on desktop, tablet and mobile devices." },
  { q: "Why should I choose this Laundry Management System?", a: "Our platform helps reduce manual work, improve customer satisfaction, automate daily operations and increase business efficiency through a modern digital solution." },
];

function FAQItem({ faq, index, active, onToggle }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (active) {
      setHeight(bodyRef.current?.scrollHeight || 0);
    } else {
      setHeight(0);
    }
  }, [active]);

  return (
    <div className={`faq-item${active ? " faq-item--open" : ""}`} style={{ "--idx": index }}>
      <button className="faq-q" onClick={onToggle} aria-expanded={active}>
        <span className="faq-q-num">0{index + 1}</span>
        <span className="faq-q-text">{faq.q}</span>
        <span className="faq-q-icon">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 7L9 12L14 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className="faq-body" style={{ height }} ref={bodyRef}>
        <p className="faq-a">{faq.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [active, setActive] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("faq-vis")),
      { threshold: 0.08 }
    );
    sectionRef.current?.querySelectorAll(".faq-anim").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="faq-section" id="faq" ref={sectionRef}>
      <div className="faq-blob faq-blob1" />
      <div className="faq-blob faq-blob2" />

      <div className="faq-wrap">
        {/* Header */}
        <div className="faq-header faq-anim">
          <div className="faq-eyebrow">
            <span className="faq-dot" />FAQ<span className="faq-dot" />
          </div>
          <h2 className="faq-h2">
            Got Questions?<br />
            <span className="faq-grad">We Have Answers</span>
          </h2>
          <p className="faq-sub">
            Learn how our platform helps laundry owners streamline operations
            and provides customers with a better service experience.
          </p>
        </div>

        {/* List */}
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div className="faq-anim" key={i} style={{ "--delay": `${i * 50}ms` }}>
              <FAQItem
                faq={faq}
                index={i}
                active={active === i}
                onToggle={() => setActive(active === i ? null : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}