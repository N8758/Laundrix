import React, { useState } from "react";
import OwnerLogin from "../pages/Owner/OwnerLogin";
import OwnerRegister from "../pages/Owner/OwnerRegister";
import "./SignupModal.css";
import CustomerLogin from "../pages/Customer/CustomerLogin";
// import StaffLogin from "../components/StaffLogin";
// import OrganizationLogin from "../pages/Owner/OrganizationLogin";

const TABS = [
  {
    id: "owner-login",
    label: "Owner Login",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: "owner-register",
    label: "Owner Register",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <line x1="19" y1="8" x2="19" y2="14"/>
        <line x1="22" y1="11" x2="16" y2="11"/>
      </svg>
    ),
  },
  {
    id: "customer-login",
    label: "Customer Login",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  // { id: "staff-login", label: "Staff Login", icon: null },
  // { id: "organization-login", label: "Organization Login", icon: null },
];

export default function SignupModal({ closeModal }) {
  const [activeTab, setActiveTab] = useState("owner-login");

  return (
    <div className="sm-overlay" onClick={closeModal}>
      <div className="sm-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="sm-header">
          <div className="sm-header__logo">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="9" fill="url(#smGrad)"/>
              <rect x="6" y="6" width="20" height="20" rx="4" stroke="white" strokeWidth="1.6"/>
              <circle cx="16" cy="18" r="5" stroke="white" strokeWidth="1.6"/>
              <circle cx="16" cy="18" r="2" fill="white" fillOpacity="0.3"/>
              <circle cx="10" cy="10" r="1.2" fill="white"/>
              <circle cx="14" cy="10" r="1.2" fill="white"/>
              <defs>
                <linearGradient id="smGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop stopColor="#0ea5e9"/>
                  <stop offset="1" stopColor="#0369a1"/>
                </linearGradient>
              </defs>
            </svg>
            <span>Laundry System</span>
          </div>
          <button className="sm-close-x" onClick={closeModal} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="sm-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`sm-tab${activeTab === tab.id ? " sm-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon && <span className="sm-tab__icon">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="sm-content">
          {activeTab === "owner-login"    && <OwnerLogin />}
          {activeTab === "owner-register" && <OwnerRegister />}
          {activeTab === "customer-login" && <CustomerLogin />}
          {/* {activeTab === "staff-login"         && <StaffLogin />} */}
          {/* {activeTab === "organization-login"  && <OrganizationLogin />} */}
        </div>

        {/* ── Close Button ── */}
        {/* <button className="sm-close-btn" onClick={closeModal}>
          Close
        </button> */}

      </div>
    </div>
  );
}