import { useEffect, useState } from "react";
import axios from "axios";
import "./style/OwnerLeave.css";

export default function OwnerLeave({ ownerId }) {
  const API = process.env.REACT_APP_API_URL;

  const [leaves, setLeaves] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(
        `${API}/api/leave/owner/${ownerId}`
      );

      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${API}/api/leave/update/${id}`,
        { status }
      );

      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="owner-leave-container">

      <h3 className="leave-title">
        Leave Requests
      </h3>

      <div className="leave-table-wrapper">

        {leaves.length === 0 ? (
          <p className="no-leave">
            No leave requests found
          </p>
        ) : (

          <table className="leave-table">

            <thead>
              <tr>
                <th>Staff</th>
                <th>From</th>
                <th>To</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {leaves.map((l) => (
                <tr key={l.id}>

                  <td>{l.name}</td>

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

                  <td className={`leave-status ${l.status.toLowerCase()}`}>
                    {l.status}
                  </td>

                  <td>
  {l.status === "Pending" ? (
    <div className="leave-btn-group">

      <button
        className="approve-btn"
        onClick={() =>
          updateStatus(l.id, "Approved")
        }
      >
        Approve
      </button>

      <button
        className="reject-btn"
        onClick={() =>
          updateStatus(l.id, "Rejected")
        }
      >
        Reject
      </button>

    </div>
  ) : (
    <span>-</span>
  )}
</td>

                </tr>
              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}