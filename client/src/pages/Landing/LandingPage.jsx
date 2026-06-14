import React, { useState } from "react";
import "./landing.css";

import Navbar from "../../components/Navbar/Navbar";
import ServicesSection from "./ServicesSection";
import FeaturesSection from "./FeaturesSection";
import AboutUsSection from "./AboutUsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import FAQ from "./FAQ";
import Testimonials from "./Testimonials";
import Footer from "../../components/Footer/Footer";

// import SignupModal from "../../components/SignupModal";

export default function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);
  // const [showSignup, setShowSignup] = useState(false);

  return (
    <div className="landing-container">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION — full width, outside page-center */}
      <header className="hero">

        {/* Background decorative blobs */}
        <div className="hero-blob hero-blob--1" />
        <div className="hero-blob hero-blob--2" />
        <div className="hero-blob hero-blob--3" />

        <div className="hero-inner">

          {/* LEFT — Text Content */}
          <div className="hero-content">

            <div className="hero-badge">
              <span className="hero-badge__dot" />
              Professional Laundry Platform
            </div>

            <h1 className="hero-title">
              Laundry Management
              <span className="hero-title__accent"> System</span>
            </h1>

            <p className="hero-subtitle">
              Smart solution for managing laundry services,
              customers &amp; payments — all in one place.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat__number">500+</span>
                <span className="hero-stat__label">Laundries</span>
              </div>
              <div className="hero-stat__divider" />
              <div className="hero-stat">
                <span className="hero-stat__number">50k+</span>
                <span className="hero-stat__label">Orders</span>
              </div>
              <div className="hero-stat__divider" />
              <div className="hero-stat">
                <span className="hero-stat__number">99%</span>
                <span className="hero-stat__label">Uptime</span>
              </div>
            </div>

            <div className="hero-buttons">
              {/* <button className="btn-primary" onClick={() => setShowSignup(true)}>
                Sign Up Free
              </button> */}

              {/* <button className="btn-secondary" onClick={() => setShowDemo(true)}>
                Request Demo
              </button> */}

              {/* <button className="btn-secondary">
                Watch Demo Video
              </button> */}

              <a href="#services" className="hero-cta-link">
                Explore Services
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

          </div>

          {/* RIGHT — Banner Image */}
          <div className="hero-image-wrap">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=700&q=80&auto=format&fit=crop"
                alt="Professional laundry service"
                className="hero-image"
              />
              {/* Floating badge on image */}
              <div className="hero-image-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                Order Delivered!
              </div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll">
          <div className="hero-scroll__line" />
          <span>Scroll</span>
        </div>

      </header>

      {/* PAGE CENTER WRAPPER */}
      <div className="page-center">

        {/* SERVICES SECTION */}
        <ServicesSection />

        {/* FEATURES SECTION */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* ABOUT US SECTION */}
        <AboutUsSection />

        {/* WHY CHOOSE US SECTION */}
        <WhyChooseUsSection />

        <Testimonials />

        <FAQ />

        <Footer />

      </div>

      {/* DEMO REQUEST MODAL */}
      {/* {showDemo && (
        <div className="modal-overlay" onClick={() => setShowDemo(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Request Demo</h2>
            <div className="signup-form">
              <input type="text" placeholder="Your Name" />
              <input type="email" placeholder="Your Email" />
              <input type="text" placeholder="Phone Number" />
              <button className="btn-primary">Submit Request</button>
            </div>
            <button className="close-btn" onClick={() => setShowDemo(false)}>Close</button>
          </div>
        </div>
      )} */}

      {/* SIGNUP MODAL */}
      {/* {showSignup && <SignupModal closeModal={() => setShowSignup(false)} />} */}

    </div>
  );
}