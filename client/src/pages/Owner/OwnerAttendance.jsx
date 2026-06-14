import { useEffect, useState } from "react";
import axios from "axios";
import "./style/OwnerAttendance.css";

export default function OwnerAttendance({ ownerId }) {

  const API = process.env.REACT_APP_API_URL;

  const [data, setData] = useState([]);

  // ✅ Fetch Attendance
  useEffect(() => {

    if (!ownerId) return;

    const fetchData = async () => {
      try {

        const res = await axios.get(
          `${API}/api/attendance/owner/${ownerId}`
        );

        console.log("ATTENDANCE:", res.data);

        setData(res.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

  }, [ownerId]);

  return (
    <div className="owner-attendance-container">

      <h3 className="attendance-title">
        Attendance (Owner View)
      </h3>

      <div className="attendance-table-wrapper">

        <table className="attendance-table">

          <thead>
            <tr>
              <th>Staff</th>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td colSpan="4" className="no-attendance">
                  No Attendance Data
                </td>
              </tr>

            ) : (

              data.map((a) => (

                <tr key={a.id}>

                  <td>{a.name}</td>

                  <td>
                    {new Date(a.check_in).toLocaleDateString()}
                  </td>

                  <td>
                    {new Date(a.check_in).toLocaleTimeString()}
                  </td>

                  <td>
                    {a.check_out
                      ? new Date(a.check_out).toLocaleTimeString()
                      : "-"}
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