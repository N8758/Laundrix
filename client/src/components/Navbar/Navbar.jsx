import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const navLinks = [
    { label: "Services", id: "services" },
    { label: "Features", id: "features" },
    { label: "About Us", id: "about" },
    { label: "Why Choose Us", id: "whychoose" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>

        {/* LEFT — Logo */}
        <div className="navbar-logo">
          <div className="navbar-logo__icon">
            {/* Washing machine icon — pure SVG, no external dependency */}
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="9" fill="url(#logoGrad)"/>
              <rect x="6" y="6" width="20" height="20" rx="4" stroke="white" strokeWidth="1.6"/>
              <circle cx="16" cy="18" r="5" stroke="white" strokeWidth="1.6"/>
              <circle cx="16" cy="18" r="2" fill="white" fillOpacity="0.3"/>
              <circle cx="10" cy="10" r="1.2" fill="white"/>
              <circle cx="14" cy="10" r="1.2" fill="white"/>
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0ea5e9"/>
                  <stop offset="1" stopColor="#0369a1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="navbar-logo__text">Laundry System</span>
        </div>

        {/* MIDDLE — Nav Links */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li
              key={link.id}
              className={`navbar-links__item${activeSection === link.id ? " navbar-links__item--active" : ""}`}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </li>
          ))}
        </ul>

        {/* RIGHT — Sign Up */}
        {/* Mobile Menu */}
<div
  className="menu-toggle"
  onClick={() => setMenuOpen(!menuOpen)}
>
  ☰
</div>

{/* RIGHT — Sign Up */}
<button
  className="navbar-signup"
  onClick={() => navigate("/signup")}
>
  Sign Up
</button>

      </nav>

      
    </>
  );
}