import React, { useEffect, useState } from "react";
import ServicesPage from "./ServicesPage";
import OwnerBookings from "./OwnerBookings";
import OwnerCharts from "./OwnerCharts";
import OwnerSettings from "./OwnerSettings";
import Overview from "./Overview";
import OwnerProfile from "./OwnerProfile";
import OwnerFeedback from "./OwnerFeedback";
import OwnerStaff from "./OwnerStaff";
import Billing from "./Billing";
import OwnerHR from "./OwnerHR";
import { useNavigate } from "react-router-dom";
import "./style/OwnerDashboard.css";
import OwnerSalary from "./OwnerSalary";
import Subscription from "./Subscription";

const TABS = [


  { key: "charts",    label: "Dashboard",    icon: "📈" },
  
  { key: "services",  label: "Services",  icon: "🧴" },
  { key: "bookings",  label: "Bookings",  icon: "📋" },
  { key: "staff", label: "Staff", icon: "👨‍🔧" },
  
  { key: "feedback",  label: "Feedback",  icon: "💬" },
  { key: "profile",   label: "Profile",   icon: "👤" },
  { key: "settings",  label: "Settings",  icon: "⚙️" },
  { key: "billing", label: "Billing", icon: "🧾" },
  { key: "hr", label: "HR", icon: "👨‍💼" },
  { key: "salary", label: "Salary", icon: "💰" },
  { key: "subscription", label: "Subscription", icon: "💳" },
  
];

export default function OwnerDashboard() {
  const [owner, setOwner] = useState(null);
  const [activeTab, setActiveTab] = useState("charts");
  const navigate = useNavigate();
  const token = localStorage.getItem("ownerToken");
  const subscription =
JSON.parse(
localStorage.getItem(
"subscription"
)
) || {};

  useEffect(() => {
    if (token) fetchOwner();
  }, [token]);

  async function fetchOwner() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/owner/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOwner(data.owner);
      } else {
        localStorage.removeItem("ownerToken");
        navigate("/owner-login");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load owner data");
    }
  }

  if (!owner)
    return (
      <div className="owner-dashboard">
        <div className="dashboard-loading">
          <div className="loading-spinner" />
          Loading your dashboard…
        </div>
      </div>
    );

  return (
    <div className="owner-dashboard">

      {/* ── HEADER ── */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-logo">🧺</div>
          <div>
            <h2 className="dashboard-title">Owner Dashboard</h2>
            <p className="dashboard-subtitle">Welcome back, {owner.name || "Owner"}</p>
          </div>
        </div>
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("ownerToken");
            navigate("/owner-login");
          }}
        >
          ⬡ Logout
        </button>
      </div>

      {/* ── TAB NAV ── */}
      <div className="tab-nav">
        {TABS.map(({ key, label, icon }) => (

<button
key={key}

className={`tab-btn ${
activeTab===key
? "active"
: ""
}`}

disabled={
subscription?.account_locked &&
key !== "subscription"
}

onClick={()=>{

if(
subscription?.account_locked &&
key!=="subscription"
){

alert(
"Your free trial or subscription has expired. Please renew."
);

return;
}

setActiveTab(key);

}}

>

<span className="tab-icon">
{icon}
</span>

{label}

</button>

))}
      </div>

      {/* ── CONTENT PANEL ── */}
      <div className="tab-panel">
        
        {activeTab === "services"  && <ServicesPage owner={owner} token={token} refreshOwner={fetchOwner} />}
        {activeTab === "bookings"  && <OwnerBookings ownerId={owner.uniqueID} />}
        {activeTab === "charts"    && <OwnerCharts ownerId={owner.uniqueID} />}
        {activeTab === "staff" && <OwnerStaff ownerId={owner.uniqueID} />}
        {activeTab === "feedback"  && <OwnerFeedback ownerIdProp={owner.uniqueID} />}
        {activeTab === "profile"   && <OwnerProfile owner={owner} token={token} refreshOwner={fetchOwner} />}
        {activeTab === "settings"  && <OwnerSettings token={token} owner={owner} refreshOwner={fetchOwner} />}
        {activeTab === "hr" && <OwnerHR ownerId={owner.owner_id} />}
        {activeTab === "salary" && <OwnerSalary ownerId={owner.uniqueID} />}
        {activeTab === "subscription" && (
  <Subscription />
)}


        {activeTab === "billing" && (
  <Billing ownerId={owner.uniqueID} owner={owner} />

  
)}

      </div>

    </div>
  );
}