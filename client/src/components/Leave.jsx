import { useState, useEffect } from "react";
import axios from "axios";
import "./Leave.css";

export default function Leave() {

  const staff = JSON.parse(
    localStorage.getItem("staff")
  );

  const API = process.env.REACT_APP_API_URL;

  const [leaves, setLeaves] = useState([]);

  const [form, setForm] = useState({
    from_date: "",
    to_date: "",
    reason: "",
  });

  // ✅ Fetch Leaves
  const fetchLeaves = async () => {
    try {

      const res = await axios.get(
        `${API}/api/leave/staff/${staff.id}`
      );

      setLeaves(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Apply Leave
  const applyLeave = async () => {
    try {

      if (!form.from_date || !form.to_date) {
        return alert("Select dates");
      }

      await axios.post(
        `${API}/api/leave/apply`,
        {
          staff_id: staff.id,
          from_date: form.from_date,
          to_date: form.to_date,
          reason: form.reason,
        }
      );

      alert("Leave applied successfully");

      setForm({
        from_date: "",
        to_date: "",
        reason: "",
      });

      fetchLeaves();

    } catch (err) {
      console.error(err);
      alert("Failed to apply leave");
    }
  };

  return (

    <div className="leave-container">

      <h3 className="leave-title">
        Leave Module
      </h3>

      {/* 📝 Form */}
      <div className="leave-form">

        <input
          className="leave-input"
          type="date"
          value={form.from_date}
          onChange={(e) =>
            setForm({
              ...form,
              from_date: e.target.value,
            })
          }
        />

        <input
          className="leave-input"
          type="date"
          value={form.to_date}
          onChange={(e) =>
            setForm({
              ...form,
              to_date: e.target.value,
            })
          }
        />

        <input
          className="leave-input"
          type="text"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) =>
            setForm({
              ...form,
              reason: e.target.value,
            })
          }
        />

        <button
          className="leave-btn"
          onClick={applyLeave}
        >
          Apply
        </button>

      </div>

      {/* 📊 Table */}
      <div className="leave-table-wrapper">

        <table className="leave-table">

          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {leaves.length === 0 ? (

              <tr>
                <td
                  colSpan="4"
                  className="no-leave-data"
                >
                  No Leave Records
                </td>
              </tr>

            ) : (

              leaves.map((l) => (

                <tr key={l.id}>

                  <td>
                    {new Date(
                      l.from_date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(
                      l.to_date
                    ).toLocaleDateString()}
                  </td>

                  <td>{l.reason}</td>

                  <td
                    className={
                      l.status === "Approved"
                        ? "status-approved"
                        : l.status === "Rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {l.status}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}