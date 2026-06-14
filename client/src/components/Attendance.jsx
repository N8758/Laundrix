import { useState, useEffect } from "react";
import axios from "axios";
import "./Attendance.css";

export default function Attendance() {

  const staff = JSON.parse(localStorage.getItem("staff"));

  const [attendance, setAttendance] = useState([]);

  const API = process.env.REACT_APP_API_URL;

  // 📍 Get current location
  const getLocation = () => {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(

        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },

        (err) => {
          reject(err);
        }

      );
    });
  };

  // ✅ Fetch attendance
  const fetchAttendance = async () => {
    try {

      const res = await axios.get(
        `${API}/api/attendance/${staff.id}`
      );

      setAttendance(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ Check-In
  const checkIn = async () => {
    try {

      const location = await getLocation();

      await axios.post(
        `${API}/api/attendance/checkin`,
        {
          staff_id: staff.id,
          lat: location.lat,
          lng: location.lng,
        }
      );

      alert("Checked In Successfully");

      fetchAttendance();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Check-in failed"
      );
    }
  };

  // ✅ Check-Out
  const checkOut = async () => {
    try {

      const location = await getLocation();

      await axios.post(
        `${API}/api/attendance/checkout`,
        {
          staff_id: staff.id,
          lat: location.lat,
          lng: location.lng,
        }
      );

      alert("Checked Out Successfully");

      fetchAttendance();

    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
        "Check-out failed"
      );
    }
  };

  return (

    <div className="attendance-container">

      <h3 className="attendance-title">
        Attendance
      </h3>

      <div className="attendance-btn-group">

        <button
          className="checkin-btn"
          onClick={checkIn}
        >
          Check In
        </button>

        <button
          className="checkout-btn"
          onClick={checkOut}
        >
          Check Out
        </button>

      </div>

      <div className="attendance-table-wrapper">

        <table className="attendance-table">

          <thead>
            <tr>
              <th>Date</th>
              <th>Check In</th>
              <th>Check Out</th>
            </tr>
          </thead>

          <tbody>

            {attendance.length === 0 ? (

              <tr>
                <td
                  colSpan="3"
                  className="no-data"
                >
                  No Attendance Data
                </td>
              </tr>

            ) : (

              attendance.map((a, i) => (

                <tr key={i}>

                  <td>
                    {new Date(
                      a.date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {a.check_in
                      ? new Date(
                          a.check_in
                        ).toLocaleTimeString()
                      : "-"}
                  </td>

                  <td>
                    {a.check_out
                      ? new Date(
                          a.check_out
                        ).toLocaleTimeString()
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