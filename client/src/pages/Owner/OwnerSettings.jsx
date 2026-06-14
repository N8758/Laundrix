import React, { useState, useEffect } from "react";
import "./style/ownersettings.css";

export default function OwnerSettings({ token, owner, refreshOwner }) {
  const [doorEnabled, setDoorEnabled] = useState(true);
  const [doorCharge, setDoorCharge] = useState(0);

  useEffect(() => {
    if (owner) {
      setDoorEnabled(owner.doorEnabled ?? true);
setDoorCharge(owner.doorCharge ?? 0);
    }
  }, [owner]);

  const saveSettings = async () => {
    await fetch(`${process.env.REACT_APP_API_URL}/api/owner/door-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
  doorEnabled: doorEnabled,
  doorCharge: Number(doorCharge)
})

    });

    alert("Settings saved!");
    refreshOwner();
  };

  return (
    <div className="owner-settings-container">
      <h3 className="owner-settings-title">
  Door Pickup Settings
</h3>

      <label className="owner-settings-checkbox">
        <input
          type="checkbox"
          checked={doorEnabled}
          onChange={() => setDoorEnabled(!doorEnabled)}
        />
        Enable Door Pickup
      </label>

      <br /><br />

      <input
  className="owner-settings-input"
  type="number"
        value={doorCharge}
        onChange={(e) => setDoorCharge(e.target.value)}
        disabled={!doorEnabled}
        placeholder="Door Pickup Charge"
      />

      <br /><br />

      <button
  className="owner-settings-btn"
  onClick={saveSettings}
>
        Save Settings
      </button>
    </div>
  );
}