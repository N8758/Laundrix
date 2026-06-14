import React, { useEffect, useRef } from "react";
import "./testimonials.css";

const testimonials = [
  {
    name: "Rajesh Patil",
    role: "Laundry Owner",
    city: "Pune",
    text: "This system has completely transformed how we manage orders and customers. Billing and order tracking are now effortless.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Rajesh+Patil&backgroundColor=5b4ef8&textColor=ffffff&fontSize=40",
    color: "#5b4ef8",
  },
  {
    name: "Priya Sharma",
    role: "Customer",
    city: "Mumbai",
    text: "I love the real-time updates and easy order tracking. The pickup and delivery process is very smooth and reliable.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=9333ea&textColor=ffffff&fontSize=40",
    color: "#9333ea",
  },
  {
    name: "Amit Deshmukh",
    role: "Laundry Business Owner",
    city: "Nashik",
    text: "WhatsApp notifications and automated billing have saved us a lot of time and improved customer satisfaction greatly.",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Amit+Deshmukh&backgroundColor=0d9488&textColor=ffffff&fontSize=40",
    color: "#0d9488",
  },
];

const stars = [1, 2, 3, 4, 5];

export default function Testimonials() {
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("tm-vis")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".tm-anim").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="tm-section" id="testimonials" ref={ref}>
      <div className="tm-blob tm-blob1" />
      <div className="tm-blob tm-blob2" />

      <div className="tm-wrap">
        {/* Header */}
        <div className="tm-header tm-anim">
          <div className="tm-eyebrow">
            <span className="tm-dot" />Testimonials<span className="tm-dot" />
          </div>
          <h2 className="tm-h2">
            What Our Users<br />
            <span className="tm-grad">Are Saying</span>
          </h2>
          <p className="tm-sub">
            Trusted by laundry owners and customers for a smarter,
            faster and more efficient laundry experience.
          </p>
        </div>

        {/* Cards */}
        <div className="tm-grid">
          {testimonials.map((t, i) => (
            <div
              className="tm-card tm-anim"
              key={i}
              style={{ "--accent": t.color, "--delay": `${i * 100}ms` }}
            >
              {/* Top quote mark */}
              <span className="tm-quote">"</span>

              {/* Stars */}
              <div className="tm-stars">
                {stars.map((s) => (
                  <svg key={s} className="tm-star" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="tm-text">{t.text}</p>

              {/* Divider */}
              <div className="tm-divider" />

              {/* User */}
              <div className="tm-user">
                <div className="tm-avatar-wrap">
                  <img
                    className="tm-avatar"
                    src={t.avatar}
                    alt={t.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="tm-avatar-fallback" style={{ background: t.color }}>
                    {t.name.charAt(0)}
                  </div>
                </div>
                <div className="tm-user-info">
                  <h4 className="tm-name">{t.name}</h4>
                  <span className="tm-role">{t.role} · {t.city}</span>
                </div>
                <div className="tm-verified">
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust bar */}
        <div className="tm-trust tm-anim" style={{ "--delay": "350ms" }}>
          <div className="tm-trust-avatars">
            {testimonials.map((t, i) => (
              <img
                key={i}
                src={t.avatar}
                alt={t.name}
                className="tm-trust-avatar"
                style={{ "--ac": t.color, zIndex: 3 - i }}
              />
            ))}
          </div>
          <div className="tm-trust-text">
            <strong>500+ businesses</strong> already using our platform
          </div>
          <div className="tm-trust-rating">
            <div className="tm-trust-stars">
              {stars.map((s) => (
                <svg key={s} viewBox="0 0 20 20" fill="#f59e0b" width="14" height="14">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span>4.9 / 5.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}