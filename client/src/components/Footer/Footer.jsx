import React from "react";
import "./footer.css";

const links = [
  { href: "#services", label: "Services" },
  { href: "#features", label: "Features" },
  { href: "#about", label: "About Us" },
  { href: "#whychoose", label: "Why Choose Us" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

const features = [
  "Order Management",
  "Customer Management",
  "Smart Billing",
  "Pickup & Delivery",
  "WhatsApp Notifications",
  "Analytics & Reports",
];

const contact = [
  { icon: "✉", text: "support@laundrysystem.com" },
  { icon: "📞", text: "+91 98765 43210" },
  { icon: "📍", text: "India" },
];

export default function Footer() {
  return (
    <footer className="ft">
      {/* top glow line */}
      <div className="ft-topline" />

      {/* background blobs */}
      <div className="ft-blob ft-blob1" />
      <div className="ft-blob ft-blob2" />
      <div className="ft-noise" />

      <div className="ft-inner">
        {/* Brand column */}
        <div className="ft-brand">
          <div className="ft-logo">
            <span className="ft-logo-icon">
              <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
                <circle cx="16" cy="16" r="14" fill="url(#lg)" />
                <path d="M10 16c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                <circle cx="16" cy="16" r="2.5" fill="white"/>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#7c6ffa"/>
                    <stop offset="1" stopColor="#c084fc"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="ft-logo-text">LaundryOS</span>
          </div>
          <p className="ft-brand-desc">
            A complete platform for managing customers, orders, billing,
            pickups, deliveries and notifications from one powerful dashboard.
          </p>
          {/* social icons */}
          <div className="ft-socials">
            {[
              { label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.975-1.304A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" },
              { label: "Twitter", path: "M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" },
              { label: "LinkedIn", path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z" },
            ].map((s) => (
              <a key={s.label} href="#" className="ft-social" aria-label={s.label}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="ft-col">
          <h4 className="ft-col-title">
            <span className="ft-col-line" />Quick Links
          </h4>
          <ul className="ft-list">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="ft-link">
                  <span className="ft-link-arrow">→</span>{l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Features */}
        <div className="ft-col">
          <h4 className="ft-col-title">
            <span className="ft-col-line" />Features
          </h4>
          <ul className="ft-list">
            {features.map((f) => (
              <li key={f} className="ft-feature-item">
                <span className="ft-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="ft-col">
          <h4 className="ft-col-title">
            <span className="ft-col-line" />Contact Us
          </h4>
          <ul className="ft-list">
            {contact.map((c) => (
              <li key={c.text} className="ft-contact-item">
                <span className="ft-contact-icon">{c.icon}</span>
                {c.text}
              </li>
            ))}
          </ul>
          <div className="ft-badge">
            <span className="ft-badge-dot" />
            System Online 24/7
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="ft-bottom">
        <div className="ft-bottom-inner">
          <p className="ft-copy">© 2026 Laundry Management System. All Rights Reserved.</p>
          <div className="ft-bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="ft-sep">·</span>
            <a href="#">Terms of Service</a>
            <span className="ft-sep">·</span>
            <a href="#">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}