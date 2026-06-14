import { useState } from "react";
// import OwnerAttendance from "./OwnerAttendance";
import OwnerLeave from "./OwnerLeave";
import "./style/OwnerHR.css";

export default function OwnerHR({ ownerId }) {

  const [tab, setTab] = useState("attendance");

  return (
    <div className="owner-hr-container">

      <h3 className="hr-title">
        Staff Management
      </h3>

      {/* 🔘 Tabs */}
      <div className="hr-tabs">

        {/* <button
          className={
            tab === "attendance"
              ? "hr-tab-btn hr-tab-active"
              : "hr-tab-btn"
          }
          onClick={() => setTab("attendance")}
        >
          Attendance
        </button> */}

        <button
          className={
            tab === "leave"
              ? "hr-tab-btn hr-tab-active"
              : "hr-tab-btn"
          }
          onClick={() => setTab("leave")}
        >
          Leave
        </button>

      </div>

      {/* 📦 Content */}
      <div className="hr-content">

        {/* {tab === "attendance" && (
          <OwnerAttendance ownerId={ownerId} />
        )} */}

        {tab === "leave" && (
          <OwnerLeave ownerId={ownerId} />
        )}

      </div>

    </div>
  );
}